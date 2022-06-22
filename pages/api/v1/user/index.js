import sql_query from 'lib/db';
import { v4 } from 'uuid';
import moment from 'moment';
import crypto from 'crypto';


function Exception({ status, message }) {
	this.status = status;
	this.message = message;
}

function badRequestException(status, message) {
	this.status = status;
	this.message = message;
}

const post = async (body) => {
	const { email, password, fullName } = body;
	const encrypted = crypto.pbkdf2Sync(password, process.env.CRYPTO_SALT, 1000, 64, `sha512`).toString(`hex`);
	try {
		const query = 'INSERT INTO users (user_id, user_email, user_password, user_full_name, user_created_at, user_role) values (?,?,?,?,?,?)';
		const results = await sql_query(query, [v4(), email, encrypted, fullName, moment().format('YYYY-MM-DD HH:mm'), '["USER"]']);
		if (results.length == 0) {
			throw new badRequestException(400, 'Bad Request, user not created!');
		}
		return { status: 200, data: { ...body } };
	} catch (err) {
		return { status: err.status, message: err.message };
	}
};

const get = async (config) => {
	try {
		const query = `SELECT * FROM users WHERE ${config.by} = ?`;
		const results = await sql_query(query, [config.by === 'user_id' ? config.user_id : config.user_email]);

		if (results.length === 0) {
			throw new Exception({ status: 404, message: 'User not found!' });
		}
		return { status: 200, data: results };
	} catch (err) {
		return { status: err.status, message: err.message };
	}
};

const handler = async (req, res) => {
	let config = {
		by: 'user_id',
		user_id: '',
		user_email: '',
	};
	if (req.query?.by) {
		config.by = req.query.by;
	}
	if (req.query?.user_id) {
		config.user_id = req.query.user_id;
	}
	if (req.query?.user_email) {
		config.user_email = req.query.user_email;
	}

	res.setHeader('Content-Type', 'application/json');
	switch (req.method) {
		case 'GET':
			const getResponse = await get(config);
			return res.status(getResponse.status).json(getResponse.data);
		case 'POST':
			const postRresponse = await post(req.body);
			return res.content().status(postRresponse.status).json(postRresponse.data);
	}
};

export default handler;
