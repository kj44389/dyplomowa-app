import sql_query from 'lib/db';

function Exception(status, message) {
	this.status = status;
	this.message = message;
}
const handler = async (req, res) => {
	if (req.method !== 'GET') {
		throw new Exception();
	}
	const test_id = req.query.test_id;

	try {
		const query = `SELECT * FROM tests_questions WHERE test_id IN (?)`;
		const results = await sql_query(query, [test_id]);
		if (results.length == 0) {
			throw new Exception(404, 'Tests not found!');
		}

		let questions_ids = [];
		for (let i of results) {
			questions_ids.push(i.question_id);
		}

		const questionsQuery = `SELECT * FROM questions WHERE question_id IN (?)`;
		const queryResults = await sql_query(questionsQuery, [questions_ids]);

		if (queryResults.length == 0) {
			throw new Exception(404, 'Tests not found!');
		}

		return res.json(queryResults);
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};

export default handler;
