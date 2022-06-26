import sql_query from 'lib/db';
import { supabase } from 'lib/supabase';

function Exception(status, message) {
	this.status = status;
	this.message = message;
}
const handler = async (req, res) => {
	res.setHeader('Cache-Control', 's-maxage=86400');
	if (req.method !== 'GET') {
		throw new Exception();
	}
	const test_id = req.query.test_id;

	try {
		let { data, error, status } = await supabase.from('tests_questions').select('question:questions(*)').eq('test_id', test_id);

		if (error || data.length === 0) throw new Exception(404, 'questions not found!');
		return res.json({ status: 200, data: data });
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};

export default handler;
