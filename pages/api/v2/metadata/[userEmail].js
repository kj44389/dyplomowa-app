import sql_query from "lib/db";
import { v4 } from "uuid";
import { supabase } from "lib/supabase";

function Exception({ status, message }) {
	this.status = status;
	this.message = message;
}
const handler = async (req, res) => {
	try {
		const userEmail = req.query.userEmail;

		if (req.method === "GET") {
			let { data, error, status } = await supabase
				.from("user_metadata")
				.select("*")
				.eq("user_email", userEmail)
				.single();
			if (error) throw new Exception({ status: 404, message: "User metadata not found" });
			return res.status(200).json({ status: 200, data: data });
		} else if (req.method === "POST") {
			const { user_email, points_total, points_scored, tests_passed, tests_total } = req.body;
			let { data, error } = await supabase.from("user_metadata").insert([
				{
					user_email: userEmail,
					points_scored: points_scored,
					points_total: points_total,
					tests_passed: tests_passed,
					tests_total: tests_total,
				},
			]);
			if (error) throw new Exception({ status: 500, message: "Internal server error. Meta-data not created" });
			return res.status(200).json({ status: 200, data: data });
		} else if (req.method === "PATCH") {
			const { id, user_email, points_scored, points_total, tests_passed, tests_total } = req.body;
			const { data, error } = await supabase
				.from("user_metadata")
				.update({
					id: id,
					user_email: user_email,
					points_scored: points_scored,
					points_total: points_total,
					tests_passed: tests_passed,
					tests_total: tests_total,
				})
				.match({ user_email: user_email });
			if (error) throw new Exception({ status: 404, message: "User metadata not found" });
			return res.status(200).json({ status: 200, data: data });
		} else {
			throw new Exception({ status: 405, message: "Method not supported" });
		}
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};

export default handler;
