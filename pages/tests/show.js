import Layout from 'components/Layout/Layout';
import MyTests from 'components/Layout/LoggedContent/MyTests/MyTests';
import _fetch from 'isomorphic-fetch';
import { getSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';

// export async function getServerSideProps(context) {
// 	const user = await getSession(context);
// 	const test_ids = [];

// 	const response = await _fetch(`${absoluteUrlPrefix}/api/test/getUserTests?user_id=${user.id}`, {
// 		method: 'GET',
// 	});
// 	const user_tests = await response.json();

// 	user_tests.forEach((test) => {
// 		test_ids.push(test.test_id);
// 	});

// 	const tests_array = await _fetch(`${absoluteUrlPrefix}/api/test/getTests?tests=${JSON.stringify(test_ids)}`, {
// 		// const tests_array = await _fetch(`${absoluteUrlPrefix}/api/test/getTests?tests=${JSON.stringify(test_ids)}`, {
// 		method: 'GET',
// 	})
// 		.then((resp) => {
// 			return resp.json();
// 		})
// 		.then((data) => {
// 			return data;
// 		});

// 	// console.log('client - tests - ', tests_array);

// 	return {
// 		props: {
// 			tests: await tests_array,
// 		},
// 	};
// }

function show({ tests }) {
	return (
		<Layout>
			<MyTests>{tests}</MyTests>
		</Layout>
	);
}

export default show;
