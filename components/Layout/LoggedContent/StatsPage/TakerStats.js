import { data } from "autoprefixer";
import _fetch from "isomorphic-fetch";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { statsContext } from "contexts/statsContext";
import { testContext } from "contexts/testContext";
import { creatorContext } from "contexts/creatorContext";
import { questionStatsContext } from "contexts/questionStatsContext";

const TakerStats = () => {
	const stats = useContext(statsContext)[0];
	const test = useContext(testContext);
	const creator = useContext(creatorContext);
	const questionStats = useContext(questionStatsContext);
	const [color, setColor] = useState("");

	useEffect(() => {
		setColor(
			stats.passed === 1 ? "text-green-400  text-center font-bold my-1" : "text-red-400  text-center font-bold my-1"
		);
	}, [stats]);

	return (
		<div className="m-2 w-full max-w-xs rounded-2xl bg-gray-800 p-4 text-red-400 shadow-lg">
			<div className="flex flex-col">
				<p className="text-md p-2 text-white">Topic: {test?.test_name}</p>
			</div>
			<div className="flex flex-col space-y-2">
				<p className="px-2 text-xs text-gray-500">Created by: {creator?.user_full_name}</p>
				<p className="px-2 text-xs text-gray-300">Due: {moment(test?.test_date).format("YYYY-MM-DD HH:mm")}</p>
				<p className="px-2 text-xs text-gray-300">
					Last try: {moment(stats?.finished_at).format("YYYY-MM-DD HH:mm")}
				</p>
			</div>
			<div className="flex flex-col justify-start space-y-2 p-2">
				<p className="text-left font-bold  text-gray-100 ">
					Points: {stats?.points_scored} / {stats?.points_total}
				</p>
				<p className="text-left font-bold  text-gray-100 ">
					Score: {((stats?.points_scored / stats?.points_total) * 100).toFixed(0)}%
				</p>

				<p className={color}>{stats?.passed === 1 ? `Test Passed!` : `Next time will be better!`}</p>
			</div>
		</div>
	);
};

export default TakerStats;
