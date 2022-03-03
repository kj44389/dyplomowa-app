import { PencilAltIcon, ChartBarIcon, PlayIcon, TrashIcon, ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react/outline';
import Layout from 'components/Layout/Layout';
import _fetch from 'isomorphic-fetch';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import Link from 'next/link';
import { v4 } from 'uuid';

export async function getServerSideProps(context) {
	const session = await getSession(context);
	let testsFetch = await _fetch(`${absoluteUrlPrefix}/api/tests/${session.email}/`, {
		method: 'GET',
	});
	let fetchedData = await testsFetch.json();
	let testsIds = [];
	for (let i of fetchedData) {
		testsIds.push(i.test_id);
	}

	const testsDataFetch = await _fetch(`${absoluteUrlPrefix}/api/tests?by=test_id&tests=${JSON.stringify(testsIds)}`, {
		method: 'GET',
	});
	let testData = await testsDataFetch.json();
	const testsDoneFetch = await _fetch(`${absoluteUrlPrefix}/api/test/done/one/${JSON.stringify(testsIds)}/${session.email}`, { method: 'GET' });
	let testDoneData = await testsDoneFetch.json();

	return {
		props: {
			testData: testData,
			testDoneData: testDoneData,
			userId: session.id,
		},
	};
}

function show({ testData, testDoneData, userId }) {
	const handleDeleteTest = async (test_id) => {
		// confirmation if user want to delete test
		// TODO: implement confirmation functionality

		// if confirmed delete test
		const response = await _fetch(`/api/test/${test_id}`, { method: 'DELETE' })
			.then((res) => res.json())
			.catch((err) => err.json());

		// TODO: implement notification with response data from fetch
	};
	const CheckIfTestDone = (test_id) => {
		return testDoneData?.data?.findIndex((testDone) => testDone.test_id === test_id);
	};
	return (
		<Layout>
			<div className='flex justify-center overflow-x-auto'>
				{testData?.data.length === 0 ? (
					<p className='my-5 text-lg'>Tests not found</p>
				) : (
					<div className='space-y-5 py-6'>
						{/* tests created */}
						{testData?.data.find((test) => test.test_creator === userId) && (
							<div className='flex items-center justify-center'>
								<ArrowSmLeftIcon className='mr-4 h-6 w-6 translate-y-1/2 rounded-md bg-gray-800/50' />
								<div className='flex-col'>
									<h2 className='my-2 text-lg font-bold tracking-wider'>Created Tests:</h2>
									{testData?.data
										?.filter((test) => test.test_creator === userId)
										?.map((test) => {
											const { test_id, test_name, test_date, test_creator } = test;
											return (
												<div key={v4()}>
													<div className='flex w-72 flex-col rounded-md bg-gray-800/30 p-8'>
														<h3>
															<span className='font-medium'>Test Name</span>: {test_name}
														</h3>
														<span className='mb-2 text-xs'>
															<span className='font-medium'>Due</span>: {moment(test_date).format('YYYY-MM-DD HH:mm')}
														</span>
														<span className=''>
															<span className='font-medium'>Participants</span>: {'4'}
														</span>
														<div className='mt-4 flex justify-between space-x-1 text-sm'>
															<div className='space-x-1'>
																<div className='tooltip tooltip-bottom' data-tip='edit'>
																	<Link href={`/test/newTest?edit=true&test_id=${test_id}`}>
																		<button className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-800/60 p-2 transition-colors hover:bg-gray-800 hover:text-green-500'>
																			<PencilAltIcon className='h-5 w-5 hover:text-green-500' />
																		</button>
																	</Link>
																</div>
																<div className='tooltip tooltip-bottom' data-tip='stats'>
																	<Link href={`/test/${test_id}/testStats`}>
																		<button className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-800/60 p-2 transition-colors hover:bg-gray-800 hover:text-green-500'>
																			<ChartBarIcon className='h-5 w-5 ' />
																		</button>
																	</Link>
																</div>
															</div>
															<div className='tooltip tooltip-bottom' data-tip='delete'>
																{/* <Link href={`/test/${test_id}/testStats`}> */}
																<button
																	className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-800/60 p-2 text-red-300 transition-colors hover:bg-gray-800 hover:text-red-500'
																	onClick={() => handleDeleteTest(test_id)}>
																	<TrashIcon className='h-5 w-5 ' />
																</button>
																{/* </Link> */}
															</div>
														</div>
													</div>
												</div>
											);
										})}
								</div>
								<ArrowSmRightIcon className='ml-4 h-6 w-6 translate-y-1/2 rounded-md bg-gray-800/50' />
							</div>
						)}

						{/* tests to join */}
						{testData?.data.find((test) => moment(test.test_date) > moment() && test.test_creator !== userId) && (
							<div className='flex items-center justify-center'>
								<ArrowSmLeftIcon className='mr-4 h-6 w-6 translate-y-1/2 rounded-md bg-gray-800/50' />
								<div className='flex-col'>
									<h2 className='my-2 text-lg font-bold tracking-wider'>Available Tests:</h2>
									{testData?.data
										?.filter((test) => moment(test.test_date) > moment() && test.test_creator !== userId)
										?.map((test) => {
											const { test_id, test_name, test_date, test_creator } = test;
											return (
												<div key={v4()}>
													<div className='flex w-72 flex-col rounded-md bg-gray-800/30 p-8'>
														<h3>
															<span className='font-medium'>Test Name</span>: {test_name}
														</h3>
														<span className='mb-2 text-xs'>
															<span className='font-medium'>Due</span>: {moment(test_date).format('YYYY-MM-DD HH:mm')}
														</span>

														<span className=''>
															<span className='font-medium'>Status</span>:
															{CheckIfTestDone(test_id) >= 0 ? (
																<>{testDoneData?.data[CheckIfTestDone(test_id)]?.passed ? ' passed' : ' failed'}</>
															) : (
																<>{' not joined'}</>
															)}
														</span>

														<div className='mt-4 flex items-center space-x-1 text-sm'>
															{CheckIfTestDone(test_id) >= 0 ? (
																<div className='tooltip tooltip-bottom' data-tip='stats'>
																	<Link href={`/test/${test_id}/testStats`}>
																		<button className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-800/60 p-2 transition-colors hover:bg-gray-800 hover:text-green-500'>
																			<ChartBarIcon className='h-5 w-5 ' />
																		</button>
																	</Link>
																</div>
															) : (
																<div className='tooltip tooltip-bottom' data-tip='join'>
																	<Link href={`/test/solve/${test_id}`}>
																		<button className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-800/60 p-2 transition-colors hover:bg-gray-800 hover:text-green-500'>
																			<PlayIcon className='h-5 w-5 ' />
																		</button>
																	</Link>
																</div>
															)}
														</div>
													</div>
												</div>
											);
										})}
								</div>
								<ArrowSmRightIcon className='ml-4 h-6 w-6 translate-y-1/2 rounded-md bg-gray-800/50' />
							</div>
						)}

						{/* tests with stats (user not a creator) */}
						{testData?.data.find((test) => moment(test.test_date) < moment() && test.test_creator !== userId) && (
							<div className='flex items-center justify-center'>
								<ArrowSmLeftIcon className='mr-4 h-6 w-6 translate-y-1/2 rounded-md bg-gray-800/50' />
								<div className='flex-col'>
									<h2 className='my-2 text-lg font-bold tracking-wider'>Archive Tests:</h2>

									{testData?.data
										?.filter((test) => moment(test.test_date) < moment() && test.test_creator !== userId)
										?.map((test) => {
											const { test_id, test_name, test_date, test_creator } = test;
											return (
												<div key={v4()}>
													<div className='flex w-72 flex-col rounded-md bg-gray-800/30 p-8'>
														<h3>
															<span className='font-medium'>Test Name</span>: {test_name}
														</h3>
														<span className='mb-2 text-xs'>
															<span className='font-medium'>Due</span>: {moment(test_date).format('YYYY-MM-DD HH:mm')}
														</span>
														<span className=''>
															<span className='font-medium'>Status</span>:
															{CheckIfTestDone(test_id) >= 0 ? (
																<>{testDoneData?.data[CheckIfTestDone(test_id)]?.passed ? ' passed' : ' failed'}</>
															) : (
																<>{' not joined'}</>
															)}
														</span>
														<div className='mt-4 flex items-center space-x-1 text-sm'>
															{CheckIfTestDone(test_id) >= 0 && (
																<div className='tooltip tooltip-bottom' data-tip='stats'>
																	<Link href={`/test/${test_id}/testStats`}>
																		<button className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-800/60 p-2 transition-colors hover:bg-gray-800 hover:text-green-500'>
																			<ChartBarIcon className='h-5 w-5 ' />
																		</button>
																	</Link>
																</div>
															)}
														</div>
													</div>
												</div>
											);
										})}
								</div>
								<ArrowSmRightIcon className='ml-4 h-6 w-6 translate-y-1/2 rounded-md bg-gray-800/50' />
							</div>
						)}
					</div>
				)}
			</div>
		</Layout>
	);
}

export default show;
