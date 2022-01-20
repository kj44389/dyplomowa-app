import _fetch from "isomorphic-fetch";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

import useSWR from "swr";
import Link from "next/link";
const fetcher = (...args) => _fetch(...args).then((res) => res.json());

const CreatorStats = ({ testId, userId }) => {
	// const { status } = useSession();
	const [loading, setLoading] = useState(true);
	const [testData, setTestData] = useState({});
	const [statsData, setStatsData] = useState({});
	const [worstQuestion, setWorstQuestion] = useState({});
	const [statsNotAvailable, setStatsNotAvailable] = useState(false);

	if (!statsData || !statsNotAvailable) {
		const { data: testDataFetch, error: dataError } = useSWR(`/api/test/${testId}`, fetcher);
		const { data: testStatsFetch, error: statsError } = useSWR(`/api/test/stats/${testId}`, fetcher);
	}

	useEffect(() => {
		if (!testDataFetch) return;
		setTestData(testDataFetch[0]);
	}, [testDataFetch]);

	useEffect(() => {
		if (!testStatsFetch || statsNotAvailable) return;
		console.log(statsError);
		if (statsError) setStatsNotAvailable(true);
		setStatsData(testStatsFetch);
	}, [testStatsFetch]);

	useEffect(() => {
		console.log("stats", statsData.questionsSummary, testId, userId);
		if (!statsData.questionsSummary) return;
		else {
			const minPickedRight = Math.min(...statsData.questionsSummary.map(({ picked_right }) => picked_right));
			let result = statsData.questionsSummary.filter(({ picked_right }) => picked_right === minPickedRight);

			setWorstQuestion(result[0]);
			setLoading(false);
		}
	}, [statsData]);
	console.log(testData, statsData, testId);

	return !loading && !statsNotAvailable ? (
		<div className="flex flex-col w-full max-w-xs md:max-w-md">
			<div className="shadow-lg rounded-2xl p-4 m-2 w-full max-w-xs md:max-w-md bg-white dark:bg-gray-800 text-red-400">
				<div className="flex flex-col">
					<p className="text-md text-black dark:text-white p-2">Temat: {testData.test_name}</p>
				</div>
				<div className="flex flex-col space-y-2">
					<p className="text-xs text-black dark:text-gray-300 px-2">Termin do: {moment(testData.test_date).format("YYYY-MM-DD HH:mm")}</p>
				</div>
				<div className="flex flex-col justify-start p-2 space-y-2">
					<p className="text-gray-700 dark:text-gray-100  text-left font-bold ">
						Ilość rozwiązań: <span className="text-md font-thin">{statsData?.Stats[0].allcount}</span>
					</p>
					<p className="text-gray-700 dark:text-gray-100  text-left font-bold ">
						Średni wynik: <span className="text-md font-thin">{((statsData?.Stats[0].avgscore / statsData?.Stats[0].avgtotal) * 100).toFixed(0)}%</span>
					</p>
					<p className="text-gray-700 dark:text-gray-100  text-left font-bold ">
						Najtrudniejsze pytanie:{" "}
						<span className="text-md font-thin">
							{console.log(worstQuestion)}
							{worstQuestion.question_name} -{" "}
							<span className="text-sm font-thin">({((worstQuestion.picked_right / worstQuestion.picked_total) * 100).toFixed(0)}%)</span>
						</span>
					</p>
					<p className="text-gray-700 dark:text-gray-100  text-left font-bold ">
						Najlepszy wynik:{" "}
						<span className="text-md font-thin">
							{statsData?.Stats[0].user_full_name} - {((statsData?.Stats[0].points_scored / statsData?.Stats[0].points_total) * 100).toFixed(0)}%
						</span>
					</p>
				</div>
			</div>
			<div className="shadow-lg rounded-2xl p-4 m-2 w-full max-w-xs md:max-w-md bg-white dark:bg-gray-800">
				<h2 className="m-4 text-lg">Analiza pytań: </h2>
				{statsData.questionsSummary.map((data, index) => {
					return (
						<div key={v4()} className="my-4 bg-gray-900 p-8 rounded-lg space-y-3">
							<span className="flex justify-center items-center text-gray-300 text-lg font-medium h-7 w-7 bg-gray-700 rounded-lg">{index + 1}</span>
							<p>Nazwa pytania: {data.question_name}</p>
							<p>
								Punkty : {data.picked_right} / {data.picked_total}{" "}
								<span className="text-thin text-xs">({((data.picked_right / data.picked_total) * 100).toFixed(0)}%)</span>
							</p>
						</div>
					);
				})}
			</div>
			<div className="shadow-lg rounded-2xl p-4 m-2 w-full max-w-xs md:max-w-md bg-white dark:bg-gray-800">
				<h2 className="m-4 text-lg">Wyniki osób które zakończyły test: </h2>
				{statsData.data.map((data, index) => {
					return (
						<div key={v4()} className="my-4 bg-gray-900 p-8 rounded-lg space-y-3">
							<span className="flex justify-center items-center text-gray-300 text-lg font-medium h-7 w-7 bg-gray-700 rounded-lg">{index + 1}</span>
							<p>Zakończony: {moment(data.finished_at).format("YYYY-MM-DD HH:mm")}</p>
							<p>
								{data.user_full_name} - Punkty : {data.points_scored} / {data.points_total}{" "}
								<span className="text-thin text-xs">({((data.points_scored / data.points_total) * 100).toFixed(0)}%)</span>
							</p>
						</div>
					);
				})}
			</div>
		</div>
	) : (
		<div className="flex flex-col w-full max-w-xs md:max-w-md">
			<div className="shadow-lg rounded-2xl p-4 m-2 w-full max-w-xs md:max-w-md text-center bg-white dark:bg-gray-800 text-red-400">
				Statystyki testów są jeszcze niedostępne, poczekaj aż ktoś ukończy test.
			</div>
			<Link href="/tests/show">
				<button className="btn btn-outline w-[200px] self-center ">Wróć</button>
			</Link>
		</div>
	);
};

export default CreatorStats;

// const TakerStats = ({ testId, userId }) => {
// 	const { status } = useSession();
// 	const [fetchStatus, setFetchStatus] = useState(false);
// 	const [stats, setStats] = useState({});
// 	const [test, setTest] = useState({});
// 	const [creator, setCreator] = useState({});
// 	const [color, setColor] = useState("");

// 	useEffect(() => {
// 		if (status === "loading") return;
// 		else if (status === "unauthenticated") return;

// 		_fetch(`/api/test/done/one/${testId}/${userId}`, { method: "GET" })
// 			.then((res) => res.json())
// 			.then((data) => {
// 				setColor(data.data[0].passed === 1 ? "text-green-400  text-center font-bold my-1" : "text-red-400  text-center font-bold my-1");
// 				setStats(data.data[0]);
// 			});
// 	}, [status]);

// 	useEffect(() => {
// 		if (stats === {}) return;

// 		_fetch(`/api/test/${testId}`, { method: "GET" })
// 			.then((res) => res.json())
// 			.then((data) => setTest(data[0]));
// 	}, [stats]);

// 	useEffect(() => {
// 		if (test === {}) return;
// 		_fetch(`/api/user/${userId}`, { method: "GET" })
// 			.then((res) => res.json())
// 			.then((data) => {
// 				setCreator(data.data[0]);
// 			});
// 	}, [test]);

// 	useEffect(() => {
// 		if (creator === {}) return;
// 		setFetchStatus(true);
// 	}, [creator]);

// 	console.log(testId);
// 	return (
// 		fetchStatus && (
// 			<div className="shadow-lg rounded-2xl p-4 m-2 w-full max-w-xs bg-white dark:bg-gray-800 text-red-400">
// 				<div className="flex flex-col">
// 					<p className="text-md text-black dark:text-white p-2">Temat: {test.test_name}</p>
// 				</div>
// 				<div className="flex flex-col space-y-2">
// 					<p className="text-xs text-black dark:text-gray-500 px-2">Stworzone przez: {creator.user_full_name}</p>
// 					<p className="text-xs text-black dark:text-gray-300 px-2">Termin do: {moment(test.test_date).format("YYYY-MM-DD HH:mm")}</p>
// 					<p className="text-xs text-black dark:text-gray-300 px-2">Ostatnie podejście: {moment(stats.finished_at).format("YYYY-MM-DD HH:mm")}</p>
// 				</div>
// 				<div className="flex flex-col justify-start p-2 space-y-2">
// 					<p className="text-gray-700 dark:text-gray-100  text-left font-bold ">
// 						Punkty: {stats.points_scored} / {stats.points_total}
// 					</p>
// 					<p className="text-gray-700 dark:text-gray-100  text-left font-bold ">Wynik: {((stats.points_scored / stats.points_total) * 100).toFixed(0)}%</p>

// 					<p className={color}>{stats.passed === 1 ? `Test Zdany!` : `Następnym razem pójdzie lepiej!`}</p>
// 					{/* <div className="flex items-center text-green-500 text-sm">
//             <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
//             </svg>
//             <span>5.5%</span>
//             <span className="text-gray-400">vs last month</span>
//         </div> */}
// 				</div>
// 			</div>
// 		)
// 	);
// };

// export default TakerStats;
