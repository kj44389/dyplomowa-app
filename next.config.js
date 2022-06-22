const isProd = process.env.NODE_ENV === "production";

module.exports = {
	//  basePath: 'http://localhost:3000/',
	basePath: "",
	absoluteUrlPrefix: isProd ? "http://127.0.0.1:3000" : "http://localhost:3000",
	serverRuntimeConfig: {
		PROJECT_ROOT: __dirname,
	},
};
