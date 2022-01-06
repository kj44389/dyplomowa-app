import sql_query from 'lib/db';

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	// const body = req.body;
	const test_id = req.query.test_id;
	// console.log('testid', test_id);
	try {
		const query = `SELECT * FROM tests_questions WHERE test_id IN (?)`;
		const results = await sql_query(query, [test_id]);
		// if (results.length == 0) {
		// 	throw new notFoundException(404, 'Tests not found!');
		// }
		// console.log(results);

		let questions_ids = [];
		results.forEach((result) => {
			// console.log('foreach', result.question_id);
			questions_ids.push(`${result.question_id}`);
		});
		// console.log('q_id', questions_ids);

		const questionsQuery = `SELECT * FROM questions WHERE question_id IN (?)`;
		const queryResults = await sql_query(questionsQuery, [questions_ids]);

		// if (queryResults.length == 0) {
		// 	throw new notFoundException(404, 'Tests not found!');
		// }
		// console.log('query', queryResults);

		return res.json(queryResults);
	} catch (err) {
		if (err instanceof notFoundException) {
			res.status(err.status).end();
		}
		res.status(500).json({ message: err.message });
	}
};
