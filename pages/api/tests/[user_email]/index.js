import sql_query from 'lib/db';

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	// const body = req.body;
	const user_email = req.query.user_email;
	try {
		const query = `SELECT * FROM test_participants WHERE user_email =?`;
		const results = await sql_query(query, [user_email]);
		if (results.length == 0) {
			throw new notFoundException(404, 'Tests not found!');
		}
		return res.json(results);
	} catch (err) {
		if (err instanceof notFoundException) {
			res.status(err.status).end();
		}
		res.status(500).json({ message: err.message });
	}
};
