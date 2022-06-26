// import sql_query from 'lib/db';
import { supabase } from 'lib/supabase';
function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	res.setHeader('Cache-Control', 'max-age=86400');
	const test_id = req.query.testId;
	try {
		if (req.method === 'GET') {
			let { data: testStats, error } = await supabase.rpc('get_test_stats', { testid: test_id });
			if (error) throw new notFoundException(404, 'Tests not found!');
			let { data: testDone, error: error2 } = await supabase.from('test_done').select('*').eq('test_id', test_id).order('finished_at', { ascending: true });
			if (error2) {
				throw new notFoundException(404, 'Tests not found!');
			}
			let { data: questionSummary, error: error3 } = await supabase.rpc('detailed_test_stats', { testid: test_id });
			if (error3) {
				throw new notFoundException(404, 'Tests not found!');
			}
			return res.json({
				status: 200,
				data: { testStats: testStats, testDone: testDone, questionSummary: questionSummary },
			});
		}
	} catch (err) {
		return res.status(err.status).json({ status: err.status, message: err.message });
	}
};
export default handler;
