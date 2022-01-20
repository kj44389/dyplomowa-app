import { warning } from "daisyui/colors/colorNames";
import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import Answer from "./Answer";
import Question from "./Question";
import ResultsCard from "./ResultsCard";
import Timer from "./Timer";

const Test = ({ testData }) => {
	const { data: user, status } = useSession();

	const [questions, setQuestions] = useState([]);
	const [question, setQuestion] = useState({});
	const [results, setResults] = useState([]);

	const [answers, setAnswers] = useState([]);
	const [fetchStatus, setFetchStatus] = useState(false);
	const [resultsFetched, setResultsFetched] = useState(false);
	const [timeRunOut, setTimeRunOut] = useState(false);
	const [timeLeft, setTimeLeft] = useState("");
	const [testState, setTestState] = useState({ index: 0, maxIndex: 0 });
	const [questionsState, setQuestionsState] = useState([]);

	// const [warnings, setWarnings] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [warnings, setWarnings] = useState(0);

	const getShuffledArr = (arr) => {
		if (arr.length === 1) {
			return arr;
		}
		const rand = Math.floor(Math.random() * arr.length);
		return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
	};

	console.log(warnings, showModal);
	useEffect(() => {
		window.addEventListener("blur", () => setShowModal(true));
	}, []);

	useEffect(() => {
		if (showModal === true) {
			if (warnings === 2) {
				window.removeEventListener("blur", () => null);
				setShowModal(false);
				handleFinishTest();
			}

			setWarnings(warnings + 1);
		}
	}, [showModal]);

	const showWarning = () => {
		console.log(warnings, showModal);
		if (showModal !== true) {
			setWarnings(warnings + 1);
			setShowModal(true);
		}
		console.log(warnings, showModal);
	};

	// fetching questions
	useEffect(() => {
		if (status === "loading") return;
		if (status === "authenticated") {
			const fetchStatus = _fetch(`${absoluteUrlPrefix}/api/test/getQuestions/${testData.test_id}`, { method: "GET" })
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					setQuestions(getShuffledArr(data));
				});
		}
	}, [status]);

	//fetching answer
	useEffect(() => {
		if (questions.length > 0 && !fetchStatus) {
			const fetchStatus = _fetch(`${absoluteUrlPrefix}/api/test/getQuestionAnswers/`, { method: "POST", body: JSON.stringify(questions) })
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					setAnswers(getShuffledArr(data));
				});
		}
	}, [questions]);

	//mark fetchStatus as true (finished)
	useEffect(() => {
		if (answers.length > 0 && !fetchStatus) {
			setFetchStatus(true);
			setTestState({ ...testState, maxIndex: questions.length - 1 });
			setTimeLeft(questions[0].question_time);

			for (let answer of answers) {
				const { answer_id, question_id } = answer;
				setQuestionsState((prev) => [...prev, { question_id: question_id, answer_id: answer_id, picked: false }]);
			}
		}
	}, [answers]);

	useEffect(() => {
		if (!fetchStatus) {
			return;
		}
		setQuestion(questions[testState.index]);
	}, [testState]);

	useEffect(() => {
		if (results.length === 0) return;
		setResultsFetched(true);
	}, [results]);

	const handleFinishTest = () => {
		setTimeRunOut(true);

		_fetch(`${absoluteUrlPrefix}/api/test/results`, {
			method: "POST",
			headers: { contentType: "application/json" },
			body: JSON.stringify({
				questions: questions,
				answers: answers,
				questionsState: questionsState,
				test_id: testData.test_id,
				user_id: user.id,
				user_email: user.email,
			}),
		})
			.then((result) => {
				return result.json();
			})
			.then((data) => {
				setResults([data]);
			});
	};

	const handleQuestionStateChange = (question_id, answer_id) => {
		const stateIndex = questionsState.findIndex((state) => {
			return state.question_id === question_id && state.answer_id === answer_id;
		});
		questionsState[stateIndex].picked = !questionsState[stateIndex].picked;
		setQuestionsState([...questionsState]);
	};

	const handleTestStateIncrement = () => {
		const { index, maxIndex } = testState;
		if (index === maxIndex) return;
		questions[index].question_time = timeLeft;
		setQuestions((prev) => [...questions]);
		setTimeLeft(questions[index + 1].question_time);
		setTestState({ ...testState, index: index + 1 });
	};

	const handleTestStateDecrement = () => {
		const { index } = testState;
		if (index === 0) return;
		questions[index].question_time = timeLeft;
		setQuestions((prev) => [...questions]);
		setTimeLeft(questions[index - 1].question_time);
		setTestState({ ...testState, index: index - 1 });
	};

	return (
		<>
			<div className="flex flex-col max-w-lg">
				{!resultsFetched && !timeRunOut && fetchStatus ? (
					<>
						{!timeRunOut && fetchStatus && (
							<>
								<>
									{/* <Timer
									timeLeft={timeLeft}
									setTimeLeft={setTimeLeft}
									testState={testState}
									questions={questions}
									handleFinishTest={handleFinishTest}
									setTestState={setTestState}
									setQuestions={setQuestions}
								/> */}

									<Question key={question?.question_id} id={testState.index + 1} numberOfQuestions={testState.maxIndex + 1} question={question}>
										{answers
											.filter((answer) => {
												return answer.question_id === question?.question_id;
											})
											.map((answer, index, mappedArray) => {
												return (
													<div key={v4()}>
														{index === 0 ? <div className="divider max-w-sm after:bg-gray-600/40 before:bg-gray-600/40"></div> : null}

														<Answer
															key={answer.answer_id}
															answer={answer}
															index={index}
															question_id={question?.question_id}
															disabled={question?.question_time === "00:00:00" ? true : false}
															picked={questionsState[questionsState.findIndex((state) => state.answer_id === answer.answer_id)]?.picked}
															onClick={handleQuestionStateChange}
														/>

														{index !== mappedArray.length - 1 ? <div className="divider max-w-sm after:bg-gray-600/40 before:bg-gray-600/40"></div> : null}
													</div>
												);
											})}
									</Question>
								</>

								<div className="self-center space-x-5 my-2">
									{testState.index === 0 ? (
										<button className="btn" disabled>
											Poprzedni
										</button>
									) : (
										<button className="btn bg-green-500 border-0" onClick={(e) => handleTestStateDecrement()}>
											Poprzedni
										</button>
									)}
									{testState.index === testState.maxIndex ? (
										<button className="btn" disabled>
											Następny
										</button>
									) : (
										<button className="btn bg-green-500 border-0" onClick={(e) => handleTestStateIncrement()}>
											Następny
										</button>
									)}
								</div>
							</>
						)}
						{timeRunOut && <h2 className="text-lg my-3">Czas się skończył.</h2>}
						<button className="btn btn-sm btn-outline self-center" onClick={(e) => handleFinishTest()}>
							Zakończ
						</button>
					</>
				) : (
					results.length > 0 && <ResultsCard results={results[0]} testName={testData.test_name} />
				)}
			</div>
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-auto my-6 mx-auto max-w-sm">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-600 outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-center justify-center p-5 rounded-t">
									<h3 className="text-3xl font-semibold text-center text-red-400">Ostrzeżenie</h3>
								</div>
								{/*body*/}
								<div className="relative p-6 flex-auto text-center">
									<p className="my-4 text-blueGray-500 text-lg leading-relaxed">Wygląda na to, że korzystasz z pomocy podczas testu. </p>
									<p className="my-4 text-blueGray-500 text-lg leading-relaxed"> Jest to niedozwolone. Nie korzystaj z pomocy inaczej test się zakończy.</p>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-center p-6 border-t border-solid border-blueGray-200 rounded-b">
									<button
										className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Zrozumiałem
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};

export default Test;
