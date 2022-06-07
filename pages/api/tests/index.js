import sql_query from 'lib/db';

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

const getAll = async () => {
	const query = `SELECT * FROM tests`;
	const results = await sql_query(query, []);
	if (results.length == 0) return { status: 404, message: 'Tests not found' };
	return { status: 200, message: results };
};
const getAllByTestsIds = async (tests) => {
	const query = 'SELECT * FROM tests WHERE test_id IN (?)';
	const results = await sql_query(query, [tests]);
	if (results.length == 0) return { status: 404, message: 'Tests not found' };
	return { status: 200, data: results };
};

const getAllByCode = async (tests) => {
	const query = 'SELECT * FROM tests WHERE test_code IN (?)';
	const results = await sql_query(query, [tests]);
	if (results.length == 0) return { status: 404, message: 'Tests not found' };
	return { status: 200, data: results };
};

const handler = async (req, res) => {
	try {
		if (req.method !== 'GET') throw new Exception(403, 'method not allowed');

		let response = {};

		response = await getAll();

		if (req.query.by === 'test_id' && req.query.tests) response = await getAllByTestsIds(JSON.parse(req.query.tests));
		if (req.query.by === 'test_code' && req.query.code) response = await getAllByCode(req.query.code);

		return res.status(response.status).json(response);
	} catch (err) {
		return res.status(err.status).json({ status: err.status, message: err.message });
	}
};

export default handler;
