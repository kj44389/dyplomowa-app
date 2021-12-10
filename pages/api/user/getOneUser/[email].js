import sql_query from '../../../../lib/db';

function notFoundException(status, message) {
     this.status = status;
     this.message = message;
}

const handler = async (req, res) => {
     try {
          const query = `SELECT * FROM users WHERE user_email=?`
          const results = await sql_query(query, [req.query.email])
          console.log(results)
          if (results.length == 0) {
               throw new notFoundException(404,'User not found!');
          }
          return res.json(results);
     } catch (err) {
          if (err instanceof notFoundException) {
               res.status(err.status).end()
          }
          res.status(500).json({message: err.message})
     }
}

export default handler