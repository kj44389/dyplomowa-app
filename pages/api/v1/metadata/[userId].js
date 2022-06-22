import sql_query from 'lib/db';
import { v4 } from 'uuid';

function Exception({ status, message }) {
	this.status = status;
	this.message = message;
}
const handler = async (req, res) => {
	try {
		const userId = req.query.userId;

		if (req.method === 'GET') {
			const query = 'SELECT * FROM user_metadata where user_id = ?';
			const response = await sql_query(query, [userId]);
			if (response.length === 0) throw new Exception({ status: 404, message: 'User metadata not found' });
			return res.status(200).json({ status: 200, data: response });
		} else if (req.method === 'POST') {
			const { user_id, points_total, points_scored, tests_passed, tests_total } = req.body;
			const query = 'INSERT INTO `user_metadata`(`id`, `user_id`, `points_scored`, `points_total`, `tests_passed`, `tests_total`) VALUES (?,?,?,?,?,?)';
			const response = await sql_query(query, [v4(), user_id, points_scored, points_total, tests_passed, tests_total]);
			return res.status(200).json({ status: 200, data: response });
		} else if (req.method === 'PATCH') {
			const { id, user_id, points_scored, points_total, tests_passed, tests_total } = req.body;
			const query = 'UPDATE `user_metadata` SET `id`=?,`user_id`=?,`points_scored`=?,`points_total`=?,`tests_passed`=?,`tests_total`=? WHERE `id`=?';
			const response = await sql_query(query, [id, user_id, points_scored, points_total, tests_passed, tests_total, id]);
			if (response.length === 0) throw new Exception({ status: 404, message: 'User metadata not found' });
			return res.status(200).json({ status: 200, data: response });
		} else {
			throw new Exception({ status: 405, message: 'Method not supported' });
		}
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};

export default handler;
