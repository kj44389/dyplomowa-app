import { FireIcon, BadgeCheckIcon, ClipboardListIcon, StarIcon } from '@heroicons/react/outline';
import _fetch from 'isomorphic-fetch';
import { useSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { useRouter } from 'next/router';
import { useState } from 'react';
import StatsCard from './StatsCard/StatsCard';

function LoggedContent() {
	const { data, status } = useSession();
	const router = useRouter();
	const [metaData, setMetaData] = useState({ points_scored: 0, points_total: 0, tests_passed: 0, tests_total: 0 });
	const [fetchStatus, setFetchStatus] = useState(false);

	if (status === 'loading') return 'Loading, please wait';
	if (status === 'unauthenticated') router.push('/login');

	if (data.id) {
		const response = _fetch(`${absoluteUrlPrefix}/api/v2/metadata/${data?.email}`, { method: 'GET' })
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (data?.status === 200) setMetaData(data.data);
			});
		response.finally(() => {
			setFetchStatus(true);
		});
	}

	return (
		fetchStatus && (
			<div className='flex h-full w-full flex-col flex-wrap items-center justify-center p-8'>
				<h2 className='my-8 text-xl font-bold uppercase tracking-widest'>Your Statistics </h2>
				<div className='flex flex-row flex-wrap justify-center'>
					<StatsCard icon={<FireIcon className='w-5 ' />} title={'Total Accuracy'} data={`${((metaData.points_scored / metaData.points_total) * 100).toFixed(0)}%`} />
					<StatsCard icon={<BadgeCheckIcon className='w-5 ' />} title={'Total Passed Tests'} data={`${metaData.tests_passed}`} />
					<StatsCard icon={<ClipboardListIcon className='w-5' />} title={'Total Tests'} data={`${metaData.tests_total}`} />
					<StatsCard icon={<StarIcon className='w-5 ' />} title={'Collected Points'} data={`${metaData.points_scored}`} />
				</div>
			</div>
		)
	);
}

export default LoggedContent;

//{/* stats */}
//
//			{/* total accuracy */}
//
//			{/* total passed tests */}
//
//			{/* Best test try in 1 week*/}
//
//			{/* total tests */}
//
//			{/* total answered questions */}
//
//			{/* total picked answers */}
//
//			{/*  */}
