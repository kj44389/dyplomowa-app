import Layout from "components/Layout/Layout";
import MyTests from "components/Layout/LoggedContent/MyTests/MyTests";
import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";

function show() {
	const [loading, setLoading] = useState(true);
	const [testData, setTestData] = useState([]);
	const [testDoneData, setTestDoneData] = useState([]);
	const [testsIds, setTestsIds] = useState([]);
	const [testsFound, setTestsFound] = useState(0);
	const { data: user, status } = useSession();

	useEffect(() => {
		if (status === "loading") return;
		if (status === "unauthenticated") return;
		const testsFetch = _fetch(`${absoluteUrlPrefix}/api/test/getUserTests?user_email=${user.email}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setTestsFound(data.length);
				data.forEach((value) => {
					setTestsIds((prev) => [...prev, value.test_id]);
				});
			});
	}, [status]);

	useEffect(() => {
		if (testsIds.length !== testsFound || testsIds.length === 0) return;
		const testsDataFetch = _fetch(`${absoluteUrlPrefix}/api/test/getTests?tests=${JSON.stringify(testsIds)}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => setTestData(data));
	}, [testsIds]);

	useEffect(() => {
		if (!testData || !user) return;
		const testsDoneDataFetch = _fetch(`${absoluteUrlPrefix}/api/test/done/${user.email}`, { method: "GET" })
			.then((res) => res.json())
			.then((data) => {
				data.status === 404 ? setTestDoneData([]) : setTestDoneData(data.data);
			});
		setLoading(false);
	}, [testData]);

	return <Layout>{!loading && <MyTests tests={testData} testsDone={testDoneData} />}</Layout>;
}

export default show;
