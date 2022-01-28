import sql_query from "lib/db";

function Exception({ status, message }) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	const slug = req.query.slug;

	try {
		if (slug.length > 3) {
			throw new Exception({ status: 400, message: "Invalid slug" });
		}

		let results;
		if (slug[0] === "one") {
			const query = "SELECT * FROM test_done WHERE test_id=? and user_email = ?";
			results = await sql_query(query, [slug[1], slug[2]]);
		} else if (slug[0] === "all") {
			const query = "SELECT * FROM test_done WHERE test_id = ?";
			results = await sql_query(query, [slug[1]]);
		} else {
			throw new Exception({ status: 400, message: "Invalid slug" });
		}

		if (results.length === 0) {
			throw new Exception({ status: 404, message: "Done tests not found" });
		}
		res.status(200).json({ status: 200, data: results });
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};
