import { useSession } from "next-auth/react";
import _fetch from "isomorphic-fetch";
import { v4 } from "uuid";
import moment from "moment";
// import crypto from 'crypto'

function MyTests({ tests }) {
  const user = useSession().data?.user;
  // console.log(crypto.randomBytes(8).toString('hex'));
  moment.locale("pl");
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
          {tests.map((test) => {
            return (
              <tr key={v4()}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    value={test.test_id}
                  />
                </td>
                <td>{test.test_name}</td>
                <td>
                  <p className="badge badge-sm">
                    {moment(test.test_date).format("YYYY-MM-DD HH:mm")}
                  </p>
                </td>
                <td>
                  <p>
                    {0}/{test.test_points_total}
                  </p>
                </td>
                <th>
                  <button className="btn btn-xs">join</button>
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
