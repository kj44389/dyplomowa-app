import sql_query from "lib/db";
import { v4 } from "uuid";
import moment from "moment";
import crypto from "crypto";

function badRequestException(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	try {
		const { email, password, fullName } = req.body;
		const encrypted = crypto.pbkdf2Sync(password, process.env.CRYPTO_SALT, 1000, 64, `sha512`).toString(`hex`);
		console.log(email, password, encrypted, fullName);
		const query = "INSERT INTO users (user_id, user_email, user_password, user_full_name, user_created_at, user_role) values (?,?,?,?,?,?)";
		const results = await sql_query(query, [v4(), email, encrypted, fullName, moment().format("YYYY-MM-DD HH:mm"), '["USER"]']);
		console.log("results", results);
		if (results.length == 0) {
			throw new badRequestException(400, "Bad Request, user not created!");
		}
		return res.json({ status: 200, data: results });
	} catch (err) {
		if (err instanceof badRequestException) {
			res.status(err.status).end();
		}
		res.status(400).json({ message: err.message });
	}
};
