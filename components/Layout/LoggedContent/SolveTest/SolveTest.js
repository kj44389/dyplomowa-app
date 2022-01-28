<<<<<<< Updated upstream
import _fetch from 'isomorphic-fetch';
import { absoluteUrlPrefix } from 'next.config';
import React, { useEffect, useState } from 'react';
import CodeForm from './CodeForm/CodeForm';
import Test from './Test/Test';

const SolveTest = ({ fetchedData }) => {
	console.log('fetched ', fetchedData);
	const [testCode, setTestCode] = useState('');
	const [testData, setTestData] = useState([]);
	const [testFound, setTestFound] = useState(false);

	useEffect(() => {
		testCode !== '' &&
=======
import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";
import CodeForm from "./CodeForm/CodeForm";
import Test from "./Test/Test";
import moment from "moment";
import ErrorPage from "components/Layout/Error/ErrorPage";

const SolveTest = ({ fetchedData, testCode, fullName, formEmail }) => {
	const [formTestCode, setFormTestCode] = useState("");

	const [testData, setTestData] = useState([]);
	const [testFound, setTestFound] = useState(false);

	const { status } = useSession();


	useEffect(() => {
		if (status === "loading") return null;
	}, [status]);

	//fetching test with test code from url params
	useEffect(() => {
		if (testCode !== null) {
>>>>>>> Stashed changes
			fetchedData.forEach((data) => {
				_fetch(`${absoluteUrlPrefix}/api/test/getTest/${data.test_id}`, { method: 'GET' })
					.then((res) => {
						return res.json();
					})
					.then((test) => {
						test[0].test_code === testCode ? setTestData(test[0]) : null;
					});
			});
<<<<<<< Updated upstream
	}, [testCode]);

	useEffect(() => {
		testData?.test_id && setTestFound(true);
	}, [testData]);

	return !testFound ? <CodeForm setTestCode={setTestCode} /> : <Test testData={testData} />;
=======
		}
	}, []);

	//fetching test with test code from form
	useEffect(() => {
		if (formTestCode === "" && testCode === null) return;

		fetchedData.forEach((data) => {
			// if (testData.length > 0) return;
			_fetch(`${absoluteUrlPrefix}/api/test/${data.test_id}`, {
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

		// @ts-ignore
		testData?.test_id && setTestFound(true);
	}, [testData]);

	return (
		<>
			{!testFound && status!=='loading' ? (
				<CodeForm key={`codeFormKey`} setFormTestCode={setFormTestCode} />
			) : moment(testData.test_date).diff(moment()) > 0 ? (
				<Test key={`testKey`} testData={testData} fullName={fullName} formEmail={formEmail} />
			) : (
				<ErrorPage title={"Koniec czasu!"} message={"Czas na wykonanie testu się skończył"} />
			)}
		</>
	);
>>>>>>> Stashed changes
};

export default SolveTest;
{/*  */}