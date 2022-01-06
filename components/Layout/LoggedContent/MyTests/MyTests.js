import { useSession } from 'next-auth/react'
import _fetch from 'isomorphic-fetch'
import { v4 } from 'uuid'
import moment from 'moment'
// import crypto from 'crypto'

function MyTests({ children }) {
    const user = useSession().data?.user
    // console.log(crypto.randomBytes(8).toString('hex'));
    moment.locale('pl')
    return (
        <div className="flex justify-center overflow-x-auto">
            <table className="table text-center w-full mt-5 md:w-2/3">
                <thead>
                    <tr>
                        <th>check</th>
                        <th>Test Name</th>
                        <th>Test Date</th>
                        <th>Points Scored / Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {children.map((test) => {
                        return (
                            <tr key={v4()}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        value={test.test_id}
                                    />
                                </td>
                                <td>
                                    {test.test_name}
                                    {/* <div className="flex items-center space-x-3">
									<div className="avatar">
										<div className="w-12 h-12 mask mask-squircle">
											<img
												src="/tailwind-css-component-profile-2@56w.png"
												alt="Avatar Tailwind CSS Component"
											/>
										</div>
									</div>
									<div>
										<div className="font-bold">
											Hart Hagerty
										</div>
										<div className="text-sm opacity-50">
											United States
										</div>
									</div>
								</div> */}
                                </td>
                                <td>
                                    {/* Zemlak, Daniel and Leannon
								<span className="badge badge-outline badge-sm">
									Desktop Support Technician
								</span> */}
                                    <p className="badge badge-sm">
                                        {moment(test.test_date).format(
                                            'YYYY-MM-DD HH:mm'
                                        )}
                                    </p>
                                </td>
                                <td>
                                    <p>
                                        {0}/{test.test_points_total}
                                    </p>
                                </td>
                                <th>
                                    <button className="btn btn-xs">
                                        details
                                    </button>
                                </th>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default MyTests
