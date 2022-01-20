import Layout from "components/Layout/Layout";
import SolveTest from "components/Layout/LoggedContent/SolveTest/SolveTest";
import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";

const solve = () => {
	const { data, status } = useSession();
	const [fetchedData, setFetchedData] = useState([]);

	useEffect(() => {
		if (status === "loading") return;
		else if (status === "authenticated") {
			console.log(data);
			const uri = `${absoluteUrlPrefix}/api/test/getUserTests?user_email=${data.email}`;
			_fetch(uri, { method: "GET" })
				.then((res) => {
					return res.json();
				})
				.then((data) => setFetchedData(data));
		} else {
		}
	}, [status]);

	useEffect(() => {
		console.log(fetchedData);
	}, [fetchedData]);

	return (
		<Layout>
			<div className="flex justify-center items-center p-5 w-full h-full">
				{fetchedData.length > 0 ? <SolveTest fetchedData={fetchedData} testCode={null} /> : null}
			</div>
		</Layout>
	);
};

export default solve;
