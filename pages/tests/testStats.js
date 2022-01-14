import Layout from "components/Layout/Layout";
import CreatorStats from "components/Layout/LoggedContent/StatsPage/CreatorStats";
import TakerStats from "components/Layout/LoggedContent/StatsPage/TakerStats";
import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const testStats = () => {
	const router = useRouter();
	const [testId, setTestId] = useState("");
	const [fetchStatus, setFetchStatus] = useState(false);
	const [testData, setTestData] = useState({});
	const [doneTestData, setDoneTestData] = useState({});
	const { data, status } = useSession();

	useEffect(() => {
		if (status === "loading") return;
		if (status === "unauthenticated") console.log("niezalogowany");
		setTestId(router.query.test_id);
	}, [status]);
	useEffect(() => {
		if (testId === "") return;
		_fetch(`/api/test/${testId}`, { method: "GET" })
			.then((res) => res.json())
			.then((data) => setTestData(data[0]));

		// _fetch(`/api/test/done/all/${testId}`, { method: "GET" })
		// 	.then((res) => res.json())
		// 	.then((data) => setDoneTestData(data));
		setFetchStatus(true);
	}, [testId]);

	console.log(testData);
	// console.log(data.id, testData.test_creator);
	return (
		<Layout>
			{" "}
			<div className="flex justify-center items-center my-4">
				{fetchStatus && data.id !== testData.test_creator ? <TakerStats testId={testId} userId={data.id} /> : <CreatorStats />}
			</div>
		</Layout>
	);
};

export default testStats;

//
