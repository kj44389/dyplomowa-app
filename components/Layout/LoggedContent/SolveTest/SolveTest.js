import _fetch from "isomorphic-fetch";
import { absoluteUrlPrefix } from "next.config";
import React, { useEffect, useState } from "react";
import CodeForm from "./CodeForm/CodeForm";
import Test from "./Test/Test";
import { v4 } from "uuid";
const SolveTest = ({ fetchedData }) => {
	console.log("fetched ", fetchedData);
	const [testCode, setTestCode] = useState("");
	const [testData, setTestData] = useState([]);
	const [testFound, setTestFound] = useState(false);

	useEffect(() => {
		testCode !== "" &&
			fetchedData.forEach((data) => {
				_fetch(`${absoluteUrlPrefix}/api/test/getTest/${data.test_id}`, {
					method: "GET",
				})
					.then((res) => {
						return res.json();
					})
					.then((test) => {
						test[0].test_code === testCode ? setTestData(test[0]) : null;
					});
			});
	}, [testCode]);

	useEffect(() => {
		testData?.test_id && setTestFound(true);
	}, [testData]);

	return !testFound ? <CodeForm setTestCode={setTestCode} /> : <Test testData={testData} />;
};

export default SolveTest;
