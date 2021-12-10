// const { rejects } = require('assert');
// const { createPool } = require('mysql');
// const pool = createPool({
//      host: 'localhost',
//      user: 'root',
//      port: 3306,
//      password: '',
//      database: 'dyplomowa_app',
// });

// pool.getConnection((err) => {
//      if (err) {
//           console.log('error while connectiong')
//      }
//      else {
//           console.log('connected')
//      }
// })

// const executeQuery = (query, queryParams) => {
//      return new Promise((resolve, rejects) => {
//           try {
//                pool.query(query, queryParams, (err, data) => {
//                     if (err) {
//                          console.log('error while executing query')
//                          rejects(err)
//                     }
//                     resolve(data)
//                })
//           } catch (error) {
//                rejects(err)
//           }
//      })
// }

// module.exports = {executeQuery};

const db = require('serverless-mysql')({
	config: {
		host: process.env.MYSQL_HOST,
		database: process.env.MYSQL_DATABASE,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
	},
});

async function sql_query(query, params = []) {
  try {
    const results = await db.query(query, params)
    await db.end()
    return results
  } catch (err) {
      throw Error(err.message)
  }
}

export default sql_query
// module.exports = {db, sql_query}