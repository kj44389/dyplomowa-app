import { useSession } from 'next-auth/react';
import _fetch from 'isomorphic-fetch';
import { v4 } from 'uuid';
import moment from 'moment';
import Link from 'next/link';
import { useState, useEffect } from 'react';
// import crypto from 'crypto'

function MyTests({ tests, testsDone }) {
	const { data: user, status } = useSession();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log(status, user);
		if (status === 'loading' || !user) return null;
		setLoading(false);
		console.log(tests, testsDone);
	}, [status]);

	moment.locale('pl');

	return (
		!loading && (
			<div className='flex justify-center overflow-x-auto'>
				{tests.length === 0 ? (
					<p className='text-lg my-5'>Aktualnie brak dostępnych testów</p>
				) : (
					<table className='table text-center w-full mt-5 max-w-5xl'>
						<thead>
							<tr>
								<th>check</th>
								<th>Test Name</th>
								<th>Test Date</th>

								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{tests.map((test) => {
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
											{test_creator === user.id || testsDone?.findIndex((testDone) => testDone.test_id === test_id) >= 0 ? (
												<Link href={`/tests/testStats?test_id=${test_id}`}>
													<button className='btn btn-xs'>stats</button>
												</Link>
											) : (
												<Link href={`/tests/solve/${test.test_code}`}>
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
		)
	);
}

export default MyTests;
