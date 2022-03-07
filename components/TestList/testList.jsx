import { ChartBarIcon, PlayIcon, TrashIcon } from '@heroicons/react/outline';
import Badge from 'components/Layout/badge/badge';
import _fetch from 'isomorphic-fetch';
import moment from 'moment';

import Link from 'next/link';
import { v4 } from 'uuid';

function TestList({ header, testDone, tests, creator = false, handleDelete = null }) {
	const CheckIfTestDone = (test_id) => {
		return testDone?.findIndex((testDone) => testDone.test_id === test_id);
	};

	return (
		<div className='flex items-center justify-center'>
			<div className='flex-col'>
				<h2 className='my-2 text-lg font-bold tracking-wider'>{header}:</h2>

				{tests?.map((test) => {
					const { test_id, test_name, test_date } = test;
					return (
						<div key={v4()} className='my-3 flex w-72 flex-col rounded-md bg-gray-800 p-8'>
							<h3>
								<span className='font-medium'>Test Name</span>: {test_name}
							</h3>
							<span className='mb-2 text-xs'>
								<span className='font-medium'>Due</span>: {moment(test_date).format('YYYY-MM-DD HH:mm')}
							</span>
							{creator && (
								<span className='mb-2 text-xs'>
									<span className='font-medium'>Participants</span>: {test?.participants}
								</span>
							)}

							{!creator && (
								<span className=''>
									<span className='font-medium'>Status</span>:
									{CheckIfTestDone(test_id) >= 0 ? (
										<>{testDone[CheckIfTestDone(test_id)]?.passed ? <Badge text={'passed'} type={'success'} /> : <Badge text={'failed'} type={'error'} />}</>
									) : (
										<Badge text={'not joined'} type={'info'} />
									)}
								</span>
							)}

							<div className='mt-4 flex items-center space-x-1 text-sm'>
								{CheckIfTestDone(test_id) >= 0 || creator ? (
									<div className='tooltip tooltip-bottom' data-tip='stats'>
										<Link href={`/test/${test_id}/stats`}>
											<button className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-700/60 p-2 transition-colors hover:bg-gray-800 hover:text-green-500'>
												<ChartBarIcon className='h-5 w-5 ' />
											</button>
										</Link>
									</div>
								) : (
									<div className='tooltip tooltip-bottom' data-tip='join'>
										<Link href={`/test/solve/${test_id}`}>
											<button className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-700/60 p-2 transition-colors hover:bg-gray-800 hover:text-green-500'>
												<PlayIcon className='h-5 w-5 ' />
											</button>
										</Link>
									</div>
								)}
								{creator && (
									<div className='tooltip tooltip-bottom' data-tip='delete'>
										{/* <Link href={`/test/${test_id}/testStats`}> */}
										<button
											className='flex h-9 w-9 items-center justify-center rounded-md bg-gray-800/60 p-2 text-red-300 transition-colors hover:bg-gray-800 hover:text-red-500'
											onClick={() => handleDelete(test_id)}>
											<TrashIcon className='h-5 w-5 ' />
										</button>
										{/* </Link> */}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default TestList;
