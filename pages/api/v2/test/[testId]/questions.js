import sql_query from 'lib/db';
import { supabase } from 'lib/supabase';

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	res.setHeader('Cache-Control', 's-maxage=86400');
	const testId = req.query.testId;

	try {
		let { data, error, status } = await supabase.from('tests_questions').select('*').eq('test_id', testId);
		if (error) {
			throw new Exception(404, 'Tests not found!');
		}

		let questions_ids = [];
		for (let i of data) {
			questions_ids.push(i.question_id);
		}

		let { data: queryResults, error: questionError } = await supabase.from('questions').select('*').in('question_id', questions_ids);
		if (questionError) {
			throw new Exception(404, 'Tests not found!');
		}

		return res.json({ status: 200, data: queryResults });
	} catch (err) {
		res.status(err.status || 500).json({
			status: err.status,
			message: err.message,
		});
	}
};
export default handler;
