import sql_query from 'lib/db';

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	if (req.method !== 'GET') {
		throw new Exception(405, 'not authorized');
	}
	const test_id = req.query.test_id;

	try {
		const query = `SELECT user_email FROM test_participants WHERE test_id IN (?)`;
		const results = await sql_query(query, [test_id]);
		if (results.length == 0) {
			throw new Exception(404, 'Participants not found!');
		}
		let emails = [];
		for (let i of results) emails.push(i.user_email);
		return res.json({ status: 200, data: [emails] });
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};

export default handler;
