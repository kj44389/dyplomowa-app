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
	return (
		<Layout>
			<div className='flex justify-center overflow-x-auto'>
				{testData?.data.length === 0 ? (
					<p className='my-5 text-lg'>Tests not found</p>
				) : (
					<table className='mt-5 table w-full max-w-5xl text-center'>
						<thead>
							<tr>
								<th>check</th>
								<th>Test Name</th>
								<th>Test Date</th>

								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{testData?.data.map((test) => {
								const { test_id, test_name, test_date, test_creator } = test;
								return (
									<tr key={v4()}>
										<td>
											<input type='checkbox' className='checkbox' value={test.test_id} />
										</td>
										<td>{test.test_name}</td>
										<td>
											<p className='badge badge-sm'>{moment(test.test_date).format('YYYY-MM-DD HH:mm')}</p>
										</td>
										<th>
											{test_creator === userId || testDoneData?.data.findIndex((testDone) => testDone.test_id === test_id) >= 0 ? (
												<>
													<Link href={`/test/${test_id}/testStats`}>
														<button className='btn btn-xs'>stats</button>
													</Link>
													<Link href={`/test/newTest?edit=true&test_id=${test_id}`}>
														<button className='btn btn-xs'>edit</button>
													</Link>
												</>
											) : (
												<Link href={`/test/solve/${test.test_id}`}>
													<button className='btn btn-xs'>join</button>
												</Link>
											)}
										</th>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</Layout>
	);
}

export default show;
//			{/* <MyTests tests={testData} testsDone={testDoneData} /> */}
