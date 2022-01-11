import sql_query from "../../../../lib/db";

function notFoundException(status, message) {
  this.status = status;
  this.message = message;
}

const handler = async (req, res) => {
  //   console.log("email", req.query.email);
  try {
    const query = `SELECT * FROM users WHERE user_email=?`;
    const results = await sql_query(query, [req.query.email]);
    //     console.log(results.length);
    if (results.length == 0) {
      throw new notFoundException(404, "User not found!");
    }
    //     console.log("getuser", results[0]);
    return res.json(results[0]);
  } catch (err) {
    if (err instanceof notFoundException) {
      res.status(err.status).end();
    }
    res.status(500).json({ message: err.message });
  }
};

export default handler;
