import _fetch from "isomorphic-fetch";
import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";
import CodeForm from "./CodeForm/CodeForm";
import Test from "./Test/Test";

import { useSession } from "next-auth/react";
const SolveTest = ({ fetchedData, testCode }) => {
	const [formTestCode, setFormTestCode] = useState("");
	const [testData, setTestData] = useState([]);
	const [testFound, setTestFound] = useState(false);

	const { status } = useSession();
	if (status === "loading") return null;

	useEffect(() => {
		if (testCode !== null) {
			fetchedData.forEach((data) => {
				_fetch(`${absoluteUrlPrefix}/api/test/${data.test_id}`, {
					method: "GET",
				})
					.then((res) => {
						return res.json();
					})
					.then((test) => {
						test[0].test_code === testCode ? setTestData(test[0]) : null;
					});
			});
		}
	}, []);

	useEffect(() => {
		if (formTestCode === "" && testCode === null) return;

		fetchedData.forEach((data) => {
			if (testData.length > 0) return;
			_fetch(`${absoluteUrlPrefix}/api/test/getTest/${data.test_id}`, {
				method: "GET",
			})
				.then((res) => {
					return res.json();
				})
				.then((test) => {
					test[0].test_code === formTestCode ? setTestData(test[0]) : null;
				});
		});
	}, [formTestCode]);

	useEffect(() => {
		console.log("td", testData);
		// @ts-ignore
		testData?.test_id && setTestFound(true);
	}, [testData]);

	return !testFound ? <CodeForm key={`codeFormKey`} setFormTestCode={setFormTestCode} /> : <Test key={`testKey`} testData={testData} />;
};

export default SolveTest;
