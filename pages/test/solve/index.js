import Layout from 'components/Layout/Layout';
import _fetch from 'isomorphic-fetch';
import { getSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { useState } from 'react';
import CodeForm from 'components/Layout/LoggedContent/SolveTest/CodeForm/CodeForm';

import moment from 'moment';
import ErrorPage from 'components/Layout/Error/ErrorPage';
import { useRouter } from 'next/router';
import NameEmailForm from 'components/Layout/LoggedContent/SolveTest/CodeNameForm/NameEmailForm';

export async function getServerSideProps(context) {
	context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
	const session = await getSession(context);
	if (!session) return { props: { tests: null } };
	let tests = [];
	const testsIds = await _fetch(`${absoluteUrlPrefix}/api/v2/tests/${session.email}`, { method: 'GET' })
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			let ids = [];
			for (let i of data.data) {
				ids.push(i.test_id);
			}
			return ids;
		});

	const fetchedTests = await _fetch(`${absoluteUrlPrefix}/api/v2/tests?by=test_id&tests=${JSON.stringify(testsIds)} `, { method: 'GET' })
		.then((res) => {
			return res.json();
		})
		.then((data) => tests.push(data.data));

	return { props: { tests: tests } };
}

const Solve = ({ tests }) => {
	const router = useRouter();
	const [formTestCode, setFormTestCode] = useState('');

	const [testData, setTestData] = useState([]);
	const [testFound, setTestFound] = useState(false);
	const [emailNameForm, setEmailNameForm] = useState({
		name: '',
		surname: '',
		email: '',
	});

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

	const handleRedirectWithFormData = async () => {
		const testId = await _fetch(`/api/v2/tests?by=test_code&code=${formTestCode}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.status !== 200) return null;
				return data.data[0].test_id;
			});
		if (!testId) router.push(`/test/solve`);
		router.push(`/test/solve/${testId}?name=${emailNameForm?.name}&surname=${emailNameForm?.surname}&email=${JSON.stringify(emailNameForm?.email)}`);
	};

	return (
		<Layout>
			{!testFound ? (
				tests ? (
					<CodeForm key={`codeFormKey`} setTestCode={setFormTestCode} crawler={testCrawler()} />
				) : (
					<NameEmailForm setEmailNameForm={setEmailNameForm} setTestCode={setFormTestCode} emailNameForm={emailNameForm} formSubmit={handleRedirectWithFormData} />
				)
			) : moment(testData?.test_date).diff(moment()) > 0 ? (
				handleRedirect()
			) : (
				<ErrorPage title={'Time has passed!'} message={'Time for solving this test has passed'} />
			)}
		</Layout>
	);
};

export default Solve;
