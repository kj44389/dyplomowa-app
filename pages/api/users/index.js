import sql_query from '../../../lib/db'
function notFoundException(status, message) {
    this.status = status
    this.message = message
}

const handler = async (req, res) => {
    try {
        const query = `SELECT user_id, user_email, user_full_name, user_role FROM users`
        const results = await sql_query(query)
        if (results.length == 0) {
            throw new notFoundException(404, 'It`s empty!')
        }
        return res.json(results)
    } catch (err) {
        if (err instanceof notFoundException) {
            res.status(err.status).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })
    }
}

export default handler
