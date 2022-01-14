import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";

import { BadgeCheckIcon, FireIcon, StarIcon, ClipboardListIcon } from "@heroicons/react/solid";

const LoggedContent = () => {
	const [metaData, setMetaData] = useState([]);
	const [fetchStatus, setFetchStatus] = useState(false);
	const { data, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;
		if (status === "unauthenticated") router.push("/login");

		const response = _fetch(`${absoluteUrlPrefix}/api/metadata/${data?.id}`, { method: "GET" })
			.then((res) => {
				return res.json();
			})
			.then((data) => setMetaData(data.data[0]));
	}, [status]);

	useEffect(() => {
		if (metaData.length === 0) return;
		setFetchStatus(true);
		console.log(metaData);
	}, [metaData]);

	return (
		fetchStatus && (
			<div className="w-full h-full flex justify-center items-center flex-col flex-wrap p-8">
				<h2 className="text-xl uppercase font-bold tracking-widest my-8">Your Statistics </h2>
				<div className="flex justify-center flex-wrap">
					<StatsCard
						icon={<FireIcon className="w-4 text-white" />}
						title={"Total Accuracy"}
						data={`${((metaData.points_scored / metaData.points_total) * 100).toFixed(0)}%`}
					/>
					<StatsCard icon={<BadgeCheckIcon className="w-4 text-white" />} title={"Total Passed Tests"} data={`${metaData.tests_passed}`} />
					<StatsCard icon={<ClipboardListIcon className="w-4 text-white" />} title={"Total Tests"} data={`${metaData.tests_total}`} />
					<StatsCard icon={<StarIcon className="w-4 text-white" />} title={"Collected Points"} data={`${metaData.points_scored}`} />
				</div>
			</div>
		)
	);
};

export default LoggedContent;

//{/* stats */}
//
//			{/* total accuracy */}
//
//			{/* total passed tests */}
//
//			{/* Best test try in 1 week*/}
//
//			{/* total tests */}
//
//			{/* total answered questions */}
//
//			{/* total picked answers */}
//
//			{/*  */}
