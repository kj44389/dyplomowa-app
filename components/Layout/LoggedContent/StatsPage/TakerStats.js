import _fetch from "isomorphic-fetch";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const TakerStats = ({ testId, userId, userEmail }) => {
	const { status } = useSession();
	const [fetchStatus, setFetchStatus] = useState(false);
	const [stats, setStats] = useState({});
	const [test, setTest] = useState({});
	const [creator, setCreator] = useState({});
	const [color, setColor] = useState("");

	useEffect(() => {
		if (status === "loading") return;
		else if (status === "unauthenticated") return;

		_fetch(`/api/test/done/one/${testId}/${userEmail}`, { method: "GET" })
			.then((res) => res.json())
			.then((data) => {
				setColor(data.data[0].passed === 1 ? "text-green-400  text-center font-bold my-1" : "text-red-400  text-center font-bold my-1");
				setStats(data.data[0]);
			});
	}, [status]);

	useEffect(() => {
		if (stats === {}) return;

		_fetch(`/api/test/${testId}`, { method: "GET" })
			.then((res) => res.json())
			.then((data) => setTest(data[0]));
	}, [stats]);

	useEffect(() => {
		if (test === {}) return;
		_fetch(`/api/user?user_id=${userId}`, { method: "GET" })
			.then((res) => res.json())
			.then((data) => {
				setCreator(data[0]);
			});
	}, [test]);

	useEffect(() => {
		if (creator === {}) return;
		setFetchStatus(true);
	}, [creator]);

	return (
		fetchStatus && (
			<div className="shadow-lg rounded-2xl p-4 m-2 w-full max-w-xs bg-white dark:bg-gray-800 text-red-400">
				<div className="flex flex-col">
					<p className="text-md text-black dark:text-white p-2">Temat: {test.test_name}</p>
				</div>
				<div className="flex flex-col space-y-2">
					<p className="text-xs text-black dark:text-gray-500 px-2">Stworzone przez: {creator.user_full_name}</p>
					<p className="text-xs text-black dark:text-gray-300 px-2">Termin do: {moment(test.test_date).format("YYYY-MM-DD HH:mm")}</p>
					<p className="text-xs text-black dark:text-gray-300 px-2">Ostatnie podejście: {moment(stats.finished_at).format("YYYY-MM-DD HH:mm")}</p>
				</div>
				<div className="flex flex-col justify-start p-2 space-y-2">
					<p className="text-gray-700 dark:text-gray-100  text-left font-bold ">
						Punkty: {stats.points_scored} / {stats.points_total}
					</p>
					<p className="text-gray-700 dark:text-gray-100  text-left font-bold ">Wynik: {((stats.points_scored / stats.points_total) * 100).toFixed(0)}%</p>

					<p className={color}>{stats.passed === 1 ? `Test Zdany!` : `Następnym razem pójdzie lepiej!`}</p>

				</div>
			</div>
		)
	);
};

export default TakerStats;
