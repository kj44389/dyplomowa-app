import sql_query from 'lib/db';
import { supabase } from '/lib/supabase';

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}
const handler = async (req, res) => {

	const questions_ids = JSON.parse(req.query.questions_ids);

	try {
		let { data, error } = await supabase.from('questions_answers').select('question_id, answer: answers!inner(*)').in('question_id', questions_ids);
		if (error) throw notFoundException(404, 'answers not found');

		return res.json({ status: 200, data: data });
	} catch (err) {
		if (err instanceof notFoundException) {
			res.status(err.status).end();
		}
		res.status(500).json({ message: err.message });
	}
};

export default handler;
