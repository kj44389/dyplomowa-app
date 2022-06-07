import _fetch from 'isomorphic-fetch';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const TakerStats = ({ testId, userId, userEmail }) => {
	const { status } = useSession();
	const [fetchStatus, setFetchStatus] = useState(false);
	const [stats, setStats] = useState({});
	const [test, setTest] = useState({});
	const [creator, setCreator] = useState({});
	const [color, setColor] = useState('');

	useEffect(() => {
		if (status === 'loading') return;
		else if (status === 'unauthenticated') return;

		_fetch(`/api/test/done/one/${JSON.stringify(testId)}/${userEmail}`, { method: 'GET' })
			.then((res) => res.json())
			.then((data) => {
				setColor(data.data[0].passed === 1 ? 'text-green-400  text-center font-bold my-1' : 'text-red-400  text-center font-bold my-1');
				setStats(data.data[0]);
			});
	}, [status, testId, userEmail]);

	useEffect(() => {
		if (stats === {}) return;

		_fetch(`/api/test/${testId}`, { method: 'GET' })
			.then((res) => res.json())
			.then((data) => setTest(data[0]));

		console.log(stats);
	}, [stats, testId]);

	useEffect(() => {
		if (test === {}) return;
		_fetch(`/api/user?user_id=${userId}`, { method: 'GET' })
			.then((res) => res.json())
			.then((data) => {
				setCreator(data[0]);
			});
	}, [test, userId]);

	useEffect(() => {
		if (creator === {}) return;
		setFetchStatus(true);
	}, [creator]);

	return (
		fetchStatus && (
			<div className='m-2 w-full max-w-xs rounded-2xl bg-white p-4 text-red-400 shadow-lg dark:bg-gray-800'>
				<div className='flex flex-col'>
					<p className='text-md p-2 text-black dark:text-white'>Topic: {test.test_name}</p>
				</div>
				<div className='flex flex-col space-y-2'>
					<p className='px-2 text-xs text-black dark:text-gray-500'>Created by: {creator.user_full_name}</p>
					<p className='px-2 text-xs text-black dark:text-gray-300'>Due: {moment(test.test_date).format('YYYY-MM-DD HH:mm')}</p>
					<p className='px-2 text-xs text-black dark:text-gray-300'>Last try: {moment(stats.finished_at).format('YYYY-MM-DD HH:mm')}</p>
				</div>
				<div className='flex flex-col justify-start space-y-2 p-2'>
					<p className='text-left font-bold  text-gray-700 dark:text-gray-100 '>
						Points: {stats?.points_scored} / {stats?.points_total}
					</p>
					<p className='text-left font-bold  text-gray-700 dark:text-gray-100 '>Score: {((stats?.points_scored / stats?.points_total) * 100).toFixed(0)}%</p>

					<p className={color}>{stats?.passed === 1 ? `Test Passed!` : `Next time will be better!`}</p>
				</div>
			</div>
		)
	);
};

export default TakerStats;
