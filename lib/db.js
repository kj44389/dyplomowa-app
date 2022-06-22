const db = require("serverless-mysql")({
	config: {
		host: process.env.MYSQL_HOST,
		database: process.env.MYSQL_DATABASE,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
	},
});

async function sql_query(query, params = []) {
	try {
		const results = await db.query(query, params);
		await db.end();
		return results;
	} catch (err) {
		throw Error(err.message);
	}
}

export default sql_query;
// module.exports = {db, sql_query}
