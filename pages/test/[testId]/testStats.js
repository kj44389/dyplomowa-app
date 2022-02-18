import Layout from 'components/Layout/Layout';
import CreatorStats from 'components/Layout/LoggedContent/StatsPage/CreatorStats';
import TakerStats from 'components/Layout/LoggedContent/StatsPage/TakerStats';
import _fetch from 'isomorphic-fetch';
import { getSession, useSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const testId = context.query.testId;
	const testData = await _fetch(`${absoluteUrlPrefix}/api/test/${testId}`, { method: 'GET' })
		.then((res) => res.json())
		.then((data) => {
			return data[0];
		});
	const type = session.id === testData.test_creator ? 'creator' : 'taker';

	return {
		props: {
			testId: testId,
			testData: testData,
			type: type,
			userId: session.id,
			userEmail: session.email,
		},
	};
}

const testStats = ({ testId, testData, type, userId, userEmail }) => {
	const statsRender = (id, test_creator) => {
		if (type === 'creator') return <CreatorStats testId={testId} userId={userId} />;
		return <TakerStats testId={testId} userId={userId} userEmail={userEmail} />;
	};

	return (
		<Layout>
			<div className='my-4 flex items-center justify-center'>{statsRender(userId, testData?.test_creator)}</div>
		</Layout>
	);
};

export default testStats;
