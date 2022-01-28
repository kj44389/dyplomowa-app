import sql_query from 'lib/db';

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	// const body = req.body;
	const testId = req.query.testId;


	try {
		const query = `SELECT * FROM tests_questions WHERE test_id IN (?)`;
		const results = await sql_query(query, [testId]);
		if (results.length == 0) {
			throw new Exception(404, 'Tests not found!');
		}

		let questions_ids = []
		for(let i of results){
			questions_ids.push(i.question_id);
		}

		const questionsQuery = `SELECT * FROM questions WHERE question_id IN (?)`;
		const queryResults = await sql_query(questionsQuery, [questions_ids]);

		if (queryResults.length == 0) {
			throw new Exception(404, 'Tests not found!');
		}

		return res.json({status: 200, data: queryResults});
	} catch (err) {
		res.status(err.status || 500 ).json({status: err.status , message: err.message });
	}
};
