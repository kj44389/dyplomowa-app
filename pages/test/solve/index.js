import Layout from 'components/Layout/Layout';
import _fetch from 'isomorphic-fetch';
import { getSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { useState } from 'react';
import CodeForm from 'components/Layout/LoggedContent/SolveTest/CodeForm/CodeForm';

import moment from 'moment';
import ErrorPage from 'components/Layout/Error/ErrorPage';
import { useRouter } from 'next/router';

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
		for (let i of tests[0]) {
			if (i.test_code === formTestCode) {
				setTestData(i);
				setTestFound(!testFound);
			}
		}
	};

	const handleRedirect = () => {
		router.push(`/test/solve/${testData?.test_id}`);
	};

	return (
		<Layout>
			{!testFound ? (
				<CodeForm key={`codeFormKey`} setTestCode={setFormTestCode} crawler={testCrawler()} />
			) : moment(testData.test_date).diff(moment()) > 0 ? (
				handleRedirect()
			) : (
				<ErrorPage title={'Koniec czasu!'} message={'Czas na wykonanie testu się skończył'} />
			)}
		</Layout>
	);
};

export default solve;
