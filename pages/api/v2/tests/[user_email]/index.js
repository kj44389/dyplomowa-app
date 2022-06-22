import sql_query from "lib/db";
import { supabase } from "lib/supabase";

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	const user_email = req.query.user_email;
	try {
		let { data, error, status } = await supabase.from("test_participants").select().eq("user_email", user_email);
		if (error) throw new notFoundException(404, "Tests not found!");

		res.json({ status: 200, data: data });
	} catch (err) {
		if (err instanceof notFoundException) {
			res.status(err.status).end();
		}
		res.status(500).json({ message: err.message });
	}
};

export default handler;
