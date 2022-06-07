import _fetch from 'isomorphic-fetch';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import useSWR from 'swr';
import Link from 'next/link';
const fetcher = (...args) => _fetch(...args).then((res) => res.json());

const CreatorStats = ({ testId, userId }) => {
	// const { status } = useSession();
	const [loading, setLoading] = useState(true);
	const [testData, setTestData] = useState({});
	const [statsData, setStatsData] = useState({});
	const [worstQuestion, setWorstQuestion] = useState({});
	const [statsNotAvailable, setStatsNotAvailable] = useState(false);

	const { data: testDataFetch, error: dataError } = useSWR(`/api/test/${testId}`, fetcher);
	const { data: testStatsFetch, error: statsError } = useSWR(`/api/test/stats/${testId}`, fetcher);

	useEffect(() => {
		if (!testDataFetch) return;
		setTestData(testDataFetch[0]);
	}, [testDataFetch]);

	useEffect(() => {
		if (!testStatsFetch || statsNotAvailable) return;

		if (statsError) setStatsNotAvailable(true);
		setStatsData(testStatsFetch);
	}, [statsNotAvailable, statsError, testStatsFetch]);

	useEffect(() => {
		if (!statsData.questionsSummary) return;
		else {
			const minPickedRight = Math.min(...statsData.questionsSummary.map(({ picked_right }) => picked_right));
			let result = statsData.questionsSummary.filter(({ picked_right }) => picked_right === minPickedRight);

			setWorstQuestion(result[0]);
			setLoading(false);
		}
	}, [statsData]);

	return !loading && !statsNotAvailable ? (
		<div className='flex w-full max-w-xs flex-col md:max-w-md'>
			<div className='m-2 w-full max-w-xs rounded-2xl bg-white p-4 text-red-400 shadow-lg dark:bg-gray-800 md:max-w-md'>
				<div className='flex flex-col'>
					<p className='text-md p-2 text-black dark:text-white'>Topic: {testData.test_name}</p>
				</div>
				<div className='flex flex-col space-y-2'>
					<p className='px-2 text-xs text-black dark:text-gray-300'>Due: {moment(testData.test_date).format('YYYY-MM-DD HH:mm')}</p>
				</div>
				<div className='flex flex-col justify-start space-y-2 p-2'>
					<p className='text-left font-bold  text-gray-700 dark:text-gray-100 '>
						Attempts: <span className='text-md font-thin'>{statsData?.Stats[0].allcount}</span>
					</p>
					<p className='text-left font-bold  text-gray-700 dark:text-gray-100 '>
						Average score: <span className='text-md font-thin'>{((statsData?.Stats[0].avgscore / statsData?.Stats[0].avgtotal) * 100).toFixed(0)}%</span>
					</p>
					<p className='text-left font-bold  text-gray-700 dark:text-gray-100 '>
						Hardest question:{' '}
						<span className='text-md font-thin'>
							{worstQuestion.question_name} - <span className='text-sm font-thin'>({((worstQuestion.picked_right / worstQuestion.picked_total) * 100).toFixed(0)}%)</span>
						</span>
					</p>
					<p className='text-left font-bold  text-gray-700 dark:text-gray-100 '>
						The best score:{' '}
						<span className='text-md font-thin'>
							{statsData?.Stats[0].user_full_name} - {((statsData?.Stats[0].points_scored / statsData?.Stats[0].points_total) * 100).toFixed(0)}%
						</span>
					</p>
				</div>
			</div>
			<div className='m-2 w-full max-w-xs rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800 md:max-w-md'>
				<h2 className='m-4 text-lg'>Questions analysis: </h2>
				{statsData.questionsSummary.map((data, index) => {
					return (
						<div key={v4()} className='my-4 space-y-3 rounded-lg bg-gray-900 p-8'>
							<span className='flex h-7 w-7 items-center justify-center rounded-lg bg-gray-700 text-lg font-medium text-gray-300'>{index + 1}</span>
							<p>Question: {data.question_name}</p>
							<p>
								Right answers : {data.picked_right} / {data.picked_total}{' '}
								<span className='text-thin text-xs'>({((data.picked_right / data.picked_total) * 100).toFixed(0)}%)</span>
							</p>
						</div>
					);
				})}
			</div>
			<div className='m-2 w-full max-w-xs rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800 md:max-w-md'>
				<h2 className='m-4 text-lg'>Scores of people who finished test: </h2>
				{statsData.data.map((data, index) => {
					return (
						<div key={v4()} className='my-4 space-y-3 rounded-lg bg-gray-900 p-8'>
							<span className='flex h-7 w-7 items-center justify-center rounded-lg bg-gray-700 text-lg font-medium text-gray-300'>{index + 1}</span>
							<p>Ended: {moment(data.finished_at).format('YYYY-MM-DD HH:mm')}</p>
							<p>
								{data.user_full_name} - Points : {data.points_scored} / {data.points_total}{' '}
								<span className='text-thin text-xs'>({((data.points_scored / data.points_total) * 100).toFixed(0)}%)</span>
							</p>
						</div>
					);
				})}
			</div>
		</div>
	) : (
		<div className='flex w-full max-w-xs flex-col md:max-w-md'>
			<div className='m-2 w-full max-w-xs rounded-2xl bg-white p-4 text-center text-red-400 shadow-lg dark:bg-gray-800 md:max-w-md'>
				Statistics are not available right now. Wait for someone to finish test.
			</div>
			<Link href='/tests/show' passHref>
				<button className='btn btn-outline w-[200px] self-center '>Back</button>
			</Link>
		</div>
	);
};

export default CreatorStats;
