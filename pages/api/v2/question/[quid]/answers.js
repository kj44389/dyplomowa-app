import sql_query from "lib/db";
import { supabase } from "/lib/supabase";

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	const question_id = JSON.parse(req.query.quid);
	try {
		let { data, error, status } = await supabase
			.from("questions_answers")
			.select("question_id, data:answers!inner(*)")
			.eq("question_id", question_id);
		if (error || data.length === 0) throw notFoundException(404, "answers not found");

		return res.json({ status: status, data: data });
	} catch (err) {
		if (err instanceof notFoundException) {
			res.status(err.status).end();
		}
		res.status(500).json({ message: err.message });
	}
};

export default handler;
