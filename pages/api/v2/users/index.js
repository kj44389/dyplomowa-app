
import {supabase} from 'lib/supabase';

function notFoundException(status, message) {
    this.status = status
    this.message = message
}

const handler = async (req, res) => {
    try {
        let {data,error,status} = await supabase.from('users').select('user_id,user_email,user_full_name');

        if (error || data.length === 0) {
            throw new notFoundException(404, 'Users not found');
        }
        return res.json({status: 200, data: data})
    } catch (err) {
        if (err instanceof notFoundException) {
            res.status(err.status).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })
    }
}

export default handler
