import Layout from 'components/Layout/Layout';
import _fetch from 'isomorphic-fetch';
import { getSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { useState } from 'react';
import CodeForm from 'components/Layout/LoggedContent/SolveTest/CodeForm/CodeForm';

import moment from 'moment';
import ErrorPage from 'components/Layout/Error/ErrorPage';
import { useRouter } from 'next/router';
import Test from '../[testId]';

export async function getServerSideProps(context) {
	const session = await getSession(context);
	let tests = [];
	const testsIds = await _fetch(`${absoluteUrlPrefix}/api/tests/${session.email}`, { method: 'GET' })
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			let ids = [];
			for (let i of data) {
				ids.push(i.test_id);
			}
			return ids;
		});

	const fetchedTests = await _fetch(`${absoluteUrlPrefix}/api/tests?by=test_id&tests=${JSON.stringify(testsIds)} `, { method: 'GET' })
		.then((res) => {
			return res.json();
		})
		.then((data) => tests.push(data.data));

	console.log('tests', tests);
	return { props: { tests: tests } };
}

const solve = ({ tests }) => {
	const router = useRouter();
	const [formTestCode, setFormTestCode] = useState('');

	const [testData, setTestData] = useState([]);
	const [testFound, setTestFound] = useState(false);

	const testCrawler = () => {
		console.log('in');
		for (let i of tests[0]) {
			console.log(i);
			if (i.test_code === formTestCode) {
				setTestData(i);
				setTestFound(!testFound);
				console.log(i);
			}
		}
	};

	// //fetching test with test code from url params
	// useEffect(() => {
	// 	if (testCode !== null) {
	// 		fetchedData.forEach((data) => {
	// 			_fetch(`${absoluteUrlPrefix}/api/test/getTest/${data.test_id}`, { method: 'GET' })
	// 				.then((res) => {
	// 					return res.json();
	// 				})
	// 				.then((test) => {
	// 					test[0].test_code === testCode ? setTestData(test[0]) : null;
	// 				});
	// 		});
	// 	}
	// }, []);

	// //fetching test with test code from form
	// useEffect(() => {
	// 	if (formTestCode === '' && testCode === null) return;

	// 	fetchedData.forEach((data) => {
	// 		// if (testData.length > 0) return;
	// 		_fetch(`${absoluteUrlPrefix}/api/test/${data.test_id}`, {
	// 			method: 'GET',
	// 		})
	// 			.then((res) => {
	// 				return res.json();
	// 			})
	// 			.then((test) => {
	// 				test[0].test_code === formTestCode ? setTestData(test[0]) : null;
	// 			});
	// 	});
	// }, [formTestCode]);

	// useEffect(() => {
	// 	// @ts-ignore
	// 	testData?.test_id && setTestFound(true);
	// }, [testData]);

	// useEffect(() => {
	// 	if (status === 'loading') return;
	// 	else if (status === 'authenticated') {
	// 		const uri = `${absoluteUrlPrefix}/api/tests/${data.email}`;
	// 		_fetch(uri, { method: 'GET' })
	// 			.then((res) => {
	// 				return res.json();
	// 			})
	// 			.then((data) => setFetchedData(data));
	// 	}
	// }, [status]);

	return (
		<Layout>
			{!testFound ? (
				<CodeForm key={`codeFormKey`} setTestCode={setFormTestCode} crawler={testCrawler()} />
			) : moment(testData.test_date).diff(moment()) > 0 ? (
				router.push(`/test/solve/${testData?.test_id}`)
			) : (
				// <Test key={`testKey`} tes={testData} fullName={fullName} formEmail={formEmail} />
				<ErrorPage title={'Koniec czasu!'} message={'Czas na wykonanie testu się skończył'} />
			)}
		</Layout>
	);
};

export default solve;
