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

		if (statsError) setStatsNotAvailable(true);
		setStatsData(testStatsFetch);
	}, [testStatsFetch]);

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
								Poprawne odpowiedzi : {data.picked_right} / {data.picked_total}{" "}
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
