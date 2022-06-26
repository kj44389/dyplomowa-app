const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	images: {
		domains: ['ralyngppqounuvyyieux.supabase.co'],
	},
	//  basePath: 'http://localhost:3000/',
	basePath: '',
	absoluteUrlPrefix: isProd ? 'https://examine-lab.vercel.app/' : 'http://localhost:3000',
	serverRuntimeConfig: {
		PROJECT_ROOT: __dirname,
	},
};
