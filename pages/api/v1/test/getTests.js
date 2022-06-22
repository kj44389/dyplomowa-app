import sql_query from 'lib/db';

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	const tests = JSON.parse(req.query.tests);

	try {
		const query = 'SELECT * FROM tests WHERE test_id IN (?)';

		const results = await sql_query(query, [...tests]);
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

export default handler;
