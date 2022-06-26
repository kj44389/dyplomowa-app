import Layout from 'components/Layout/Layout';
import CreatorStats from 'components/Layout/LoggedContent/StatsPage/CreatorStats';
import TakerStats from 'components/Layout/LoggedContent/StatsPage/TakerStats';
import _fetch from 'isomorphic-fetch';
import { getSession, useSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { statsContext } from 'contexts/statsContext';
import { testContext } from 'contexts/testContext';
import { creatorContext } from 'contexts/creatorContext';
import { questionStatsContext } from 'contexts/questionStatsContext';
export async function getServerSideProps(context) {
	context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
	const session = await getSession(context);
	const testId = context.query.testId;
	const testData = await _fetch(`${absoluteUrlPrefix}/api/v2/test/${testId}`, { method: 'GET' })
		.then((res) => res.json())
		.then((data) => {
			return data.data[0];
		});
	let stats;
	if (session.id === testData.test_creator) {
		stats = await _fetch(`${absoluteUrlPrefix}/api/v2/test/done/all/${testId}`, {
			method: 'GET',
		})
			.then((res) => res.json())
			.then((data) => {
				return data.data;
			});
	} else {
		stats = await _fetch(`${absoluteUrlPrefix}/api/v2/test/done/one/${JSON.stringify([testId])}/${session.email}`, {
			method: 'GET',
		})
			.then((res) => res.json())
			.then((data) => {
				return data.data;
			});
	}
	const creator = await _fetch(`${absoluteUrlPrefix}/api/v2/user?user_id=${testData?.test_creator}`, { method: 'GET' })
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			return data;
		});
	const questionStats = await _fetch(`${absoluteUrlPrefix}/api/v2/test/stats/${testId}`)
		.then((res) => res.json())
		.then((data) => data);
	const type = session.id === testData?.test_creator ? 'creator' : 'taker';

	return {
		props: {
			testId: testId,
			stats: stats,
			questionStats: questionStats?.data,
			creator: creator,
			testData: testData,
			type: type,
			userId: session.id,
			userEmail: session.email,
		},
	};
}

const stats = ({ testId, stats, questionStats, creator, testData, type, userId, userEmail }) => {
	return (
		<Layout>
			<div className='my-4 flex items-center justify-center'>
				<testContext.Provider value={testData}>
					<statsContext.Provider value={stats}>
						<creatorContext.Provider value={creator}>
							{type === 'creator' ? (
								<questionStatsContext.Provider value={questionStats}>
									<CreatorStats />
								</questionStatsContext.Provider>
							) : (
								<TakerStats />
							)}
						</creatorContext.Provider>
					</statsContext.Provider>
				</testContext.Provider>
			</div>
		</Layout>
	);
};

export default stats;
