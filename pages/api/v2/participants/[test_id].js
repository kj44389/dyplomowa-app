import sql_query from "lib/db";
import { supabase } from "lib/supabase";

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	if (req.method !== "GET") {
		throw new Exception(405, "not authorized");
	}
	const test_id = req.query.test_id;

	try {
		let { data, error, status } = await supabase
			.from("test_participants")
			.select("user_email")
			.eq("test_id", test_id);
		if (error) {
			throw new Exception(404, "Participants not found!");
		}
		let emails = [];
		for (let i of data) emails.push(i.user_email);
		return res.json({ status: 200, data: [emails] });
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};

export default handler;
