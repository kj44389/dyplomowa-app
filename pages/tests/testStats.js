import Layout from 'components/Layout/Layout';
import CreatorStats from 'components/Layout/LoggedContent/StatsPage/CreatorStats';
import TakerStats from 'components/Layout/LoggedContent/StatsPage/TakerStats';
import _fetch from 'isomorphic-fetch';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const testStats = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [testData, setTestData] = useState({});
	const [doneTestData, setDoneTestData] = useState({});
	const [pageState, setPageState] = useState({});
	const { data: user, status } = useSession();

	useEffect(() => {
		let state = {};
		if (router.query.test_id) {
			state = { test_id: router.query.test_id, user: user };
			localStorage.setItem('state', JSON.stringify(state));
		} else state = JSON.parse(localStorage.getItem('state'));
		if (state?.test_id) setPageState({ ...state });
	}, []);

	useEffect(() => {
		if (!pageState?.test_id || !pageState?.user) return;

		_fetch(`/api/test/${pageState.test_id}`, { method: 'GET' })
			.then((res) => res.json())
			.then((data) => setTestData(data[0]));
	}, [pageState]);
	useEffect(() => {
		if (!pageState?.test_id || !pageState?.user || !testData) return;

		setLoading(false);
	}, [testData]);

	const statsRender = (id, test_creator) => {
		if (loading || !test_creator || !id) return;

		if (id === test_creator) return <CreatorStats testId={pageState?.test_id} userId={pageState?.user.id} />;
		return <TakerStats testId={pageState?.test_id} userId={pageState?.user.id} userEmail={pageState?.user.email} />;
	};

	return (
		<Layout>
			<div className='flex justify-center items-center my-4'>{!loading && statsRender(pageState?.user.id, testData?.test_creator)}</div>
		</Layout>
	);
};

export default testStats;

//
