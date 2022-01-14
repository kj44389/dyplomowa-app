import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { v4 } from "uuid";
// import crypto from 'crypto'

function MyTests({ tests, testsDone }) {
	const { data, status } = useSession();
	useEffect(() => {
		if (status === "loading") return null;
	}, [status]);

	const user = data?.user;
	moment.locale("pl");

	console.log(tests, testsDone);
	return (
		<div className="flex justify-center overflow-x-auto">
			<table className="table text-center w-full mt-5 md:w-2/3">
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
									<input type="checkbox" className="checkbox" value={test.test_id} />
								</td>
								<td>{test.test_name}</td>
								<td>
									<p className="badge badge-sm">{moment(test.test_date).format("YYYY-MM-DD HH:mm")}</p>
								</td>
								<th>
									{testsDone.findIndex((testDone) => testDone.test_id === test_id) >= 0 ? (
										<Link href={`/tests/testStats?test_id=${test_id}`}>
											<button className="btn btn-xs">stats</button>
										</Link>
									) : (
										<Link href={`/tests/solve/${test.test_code}`}>
											<button className="btn btn-xs">join</button>
										</Link>
									)}
								</th>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default MyTests;
