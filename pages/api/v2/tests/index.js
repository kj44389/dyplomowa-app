import sql_query from 'lib/db';
import {supabase} from '/lib/supabase';

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

const getAll = async () => {
	let {data,error,status} = await supabase.from('tests').select('*');
	if (error) return { status: 404, message: 'Tests not found' };
	return { status: 200, data: data };
};
const getAllByTestsIds = async (tests) => {
	let {data,error,status} = await supabase.from('tests').select('*').in('test_id', tests);
	if (error) return { status: 404, message: 'Tests not found' };
	return { status: 200, data: data };
};

const getAllByCode = async (tests) => {
	let {data,error,status} = await supabase.from('tests').select('*').eq('test_code', tests);
	if (error) return { status: 404, message: 'Tests not found' };
	return { status: 200, data: data };
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
