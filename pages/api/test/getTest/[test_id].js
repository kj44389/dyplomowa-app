import sql_query from 'lib/db';

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	const test_id = req.query.test_id;
	try {
		const query = 'SELECT * FROM tests WHERE test_id IN (?)';

		const results = await sql_query(query, [test_id]);
		console.log('-----------------------------------------------------------------------------', results);
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
