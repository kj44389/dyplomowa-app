import sql_query from "lib/db";

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	const test_id = req.query.testId;
	console.log("api - test id:", test_id);
	try {
		if (req.method === "GET") {
			const query =
				"SELECT Stats.* , (SELECT COUNT(user_email) from test_done WHERE test_id =?) as allcount ,(SELECT AVG(points_scored) from test_done WHERE test_id = ?) as avgscore,(SELECT AVG(points_total) from test_done WHERE test_id =?) as avgtotal, U.user_full_name FROM test_done as Stats LEFT JOIN users U ON U.user_Id = Stats.user_email WHERE test_id = ? ORDER BY points_scored DESC, finished_at ASC LIMIT 1";
			const results = await sql_query(query, [test_id, test_id, test_id, test_id]);
			if (results.length == 0) {
				throw new notFoundException(404, "Tests not found!");
			}
			const query2 =
				"SELECT Stats.*, U.user_full_name FROM test_done as Stats LEFT JOIN users as U ON U.user_email = Stats.user_email WHERE test_id = ? ORDER BY finished_at ASC";
			const results2 = await sql_query(query2, [test_id]);
			if (results2.length == 0) {
				throw new notFoundException(404, "Tests not found!");
			}
			const query3 =
				"SELECT qa.question_id, q.question_name, qa.id, SUM(a.answer_correct = td.picked) as picked_right , COUNT(td.picked) as picked_total from answers as a right JOIN test_done_answers td on td.answer_id = a.answer_id right join questions_answers qa on qa.answer_id = a.answer_id right join questions q on q.question_id =qa.question_id where a.answer_id IN (SELECT answer_id from questions_answers WHERE question_id IN (SELECT question_id FROM `tests_questions` WHERE test_id = ?)) AND td.done_id IN (SELECT done_id from test_done where test_id = ?) GROUP by qa.question_id ORDER BY qa.id ASC";
			const results3 = await sql_query(query3, [test_id, test_id]);
			if (results3.length == 0) {
				throw new notFoundException(404, "Tests not found!");
			}
			console.log(results[0]);
			return res.json({ status: 200, error: null, Stats: results, data: results2, questionsSummary: results3 });
		}
	} catch (err) {
		if (err instanceof notFoundException) {
			return res.status(err.status).end();
		}
		return res.status(500).json({ message: err.message });
	}
};
