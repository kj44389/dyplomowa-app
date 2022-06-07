import sql_query from 'lib/db';

function badRequestException(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	try {
		const data = JSON.parse(req.params.json);

		const query = 'INSERT INTO users (user_id, user_email, user_full_name, user_created_at, user_roles) values (?,?,?,?,?)';
		const results = await sql_query(query, [data.id, data.email, data.fullname, data.created, data.roles]);
		console.log(results);
		if (results.length == 0) {
			throw new badRequestException(400, 'Bad Request, user not created!');
		}
		return res.json(results);
	} catch (err) {
		if (err instanceof badRequestException) {
			res.status(err.status).end();
		}
		res.status(400).json({ message: err.message });
	}
};

export default handler;
