import sql_query from 'lib/db';

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	const body = JSON.parse(req.body);

	let questions_ids = [];
	body.forEach((item) => {
		questions_ids.push(`${item.question_id}`);
	});

	try {
		let query = '';
		let queryResults = [];

		query = `SELECT a.* , q.question_id from questions_answers as qa inner join answers as a on qa.answer_id = a.answer_id inner join questions as q on qa.question_id = q.question_id where qa.question_id in (?)`;
		queryResults = await sql_query(query, [questions_ids]);

		console.log('q', questions_ids, 'a', queryResults);
		return res.json(queryResults);
	} catch (err) {
		if (err instanceof notFoundException) {
			res.status(err.status).end();
		}
		res.status(500).json({ message: err.message });
	}
};
