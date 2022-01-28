import Layout from "components/Layout/Layout";
import NameEmailForm from "components/Layout/LoggedContent/SolveTest/CodeNameForm/NameEmailForm";
import SolveTest from "components/Layout/LoggedContent/SolveTest/SolveTest";
import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const solve = () => {
	const router = useRouter();
	const testCode = router.query.testCode;

	const { data, status } = useSession();
	const [fetchedData, setFetchedData] = useState([]);
	const [emailNameForm, setEmailNameForm] = useState({
		email: "",
		name: "",
		surname: "",
	});
	const [notLogged, setNotLogged] = useState(false);
	const formSubmit = async () => {
		fetchTest();
	};

	const fetchTest = async () => {
		let uri = ``;
		if (!data) uri = `${absoluteUrlPrefix}/api/tests/${emailNameForm.email}`;
		else uri = `${absoluteUrlPrefix}/api/tests/${data.email}`;

		_fetch(uri, { method: "GET" })
			.then((res) => {
				return res.json();
			})
			.then((data) => setFetchedData(data));
		setNotLogged(false);
	};

	useEffect(() => {
		if (status === "loading") return;
		if (status === "authenticated") {
			fetchTest();
		} else {
			setNotLogged(true);
		}
	}, [status]);

	return (
		<Layout>
			<div className="flex justify-center items-center p-5 w-full h-full">
				{fetchedData.length > 0 ? (
					<SolveTest
						fetchedData={fetchedData}
						testCode={testCode}
						fullName={status === "authenticated" ? data.fullName : `${emailNameForm.name} ${emailNameForm.surname}`}
						formEmail={emailNameForm.email}
					/>
				) : null}
				{notLogged && <NameEmailForm setEmailNameForm={setEmailNameForm} emailNameForm={emailNameForm} formSubmit={formSubmit} />}
			</div>
		</Layout>
	);
};

export default solve;
