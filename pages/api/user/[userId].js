import sql_query from "lib/db";

function Exception({ status, message }) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	const userId = req.query.userId;

	try {
		const query = "SELECT * FROM users WHERE user_id = ?";
		const results = await sql_query(query, [userId]);

		if (results.length === 0) {
			throw new Exception({ status: 404, message: "Done tests not found" });
		}
		res.status(200).json({ status: 200, data: results });
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};
