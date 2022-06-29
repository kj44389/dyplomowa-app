// import sql_query from 'lib/db';
import { supabase } from '/lib/supabase';

function Exception({ status, message }) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	const slug = req.query.slug;
	try {
		if (slug.length > 3) {
			throw new Exception({ status: 400, message: 'Invalid slug' });
		}

		let results;
		if (slug[0] === 'one') {
			let { data, error, status } = await supabase
				.from('test_done')
				.select('*')
				.in('test_id', [JSON.parse(slug[1])])
				.eq('user_email', slug[2]);
			if (error) throw new Exception({ status: 404, message: 'Done tests not found' });
			res.status(200).json({ status: 200, data: data });
		} else if (slug[0] === 'all') {
			let { data, error, status } = await supabase.from('test_done').select('*').eq('test_id', slug[1]);
			if (error) throw new Exception({ status: 404, message: 'Done tests not found' });
			res.status(200).json({ status: 200, data: data });
		} else {
			throw new Exception({ status: 400, message: 'Invalid slug' });
		}
	} catch (err) {
		res.status(err.status).json({ status: err.status, message: err.message });
	}
};

export default handler;
