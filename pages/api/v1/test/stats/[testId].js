import sql_query from "lib/db";

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	const test_id = req.query.testId;
	try {
		if (req.method === "GET") {
			const query =
				"SELECT Stats.* , (SELECT COUNT(user_email) from test_done WHERE test_id =?) as allcount ,(SELECT AVG(points_scored) from test_done WHERE test_id = ?) as avgscore,(SELECT AVG(points_total) from test_done WHERE test_id =?) as avgtotal FROM test_done as Stats WHERE test_id = ? ORDER BY points_scored DESC, finished_at ASC LIMIT 1";
			const results = await sql_query(query, [test_id, test_id, test_id, test_id]).then((res) => {
				if (res.length == 0) {
					throw new notFoundException(404, "Tests not found!");
				}
				return res;
			});
			const query2 = "SELECT Stats.* FROM test_done as Stats WHERE test_id = ? ORDER BY finished_at ASC";
			const results2 = await sql_query(query2, [test_id]).then((res) => {
				if (res.length == 0) {
					throw new notFoundException(404, "Tests not found!");
				}
				return res;
			});
			const query3 =
				"SELECT qa.question_id, q.question_name, qa.id, SUM(a.answer_correct = td.picked) as picked_right , COUNT(td.picked) as picked_total from answers as a right JOIN test_done_answers td on td.answer_id = a.answer_id right join questions_answers qa on qa.answer_id = a.answer_id right join questions q on q.question_id =qa.question_id where a.answer_id IN (SELECT answer_id from questions_answers WHERE question_id IN (SELECT question_id FROM `tests_questions` WHERE test_id = ?)) AND td.done_id IN (SELECT done_id from test_done where test_id = ?) GROUP by qa.question_id ORDER BY qa.id ASC";
			const results3 = await sql_query(query3, [test_id, test_id]).then((res) => {
				if (res.length == 0) {
					throw new notFoundException(404, "Tests not found!");
				}
				return res;
			});

			return res.json({ status: 200, error: null, Stats: results, data: results2, questionsSummary: results3 });
		}
	} catch (err) {
		return res.status(err.status).json({ status: err.status, message: err.message });
	}
};
export default handler;
