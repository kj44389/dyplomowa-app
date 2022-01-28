<<<<<<< Updated upstream
import _fetch from 'isomorphic-fetch';
import { useSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import React, { useEffect, useState } from 'react';

import { serialize, deserialize } from 'react-serialize';
import Answer from './Answer';
import Question from './Question';

const Test = ({ testData }) => {
	const { status } = useSession();
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [fetched, setFetched] = useState(false);
	const [questionState, setQuestionState] = useState([]);
	const [testState, setTestState] = useState({
		index: 0,
		maxIndex: 0,
	});
	// fetching questions
	useEffect(() => {
		if (status === 'loading') return;
		if (status === 'authenticated') {
			const fetched = _fetch(`${absoluteUrlPrefix}/api/test/getQuestions/${testData.test_id}`, { method: 'GET' })
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					setQuestions(data);
				});
		}
=======
import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import Answer from "./Answer";
import Question from "./Question";
import ResultsCard from "./ResultsCard";
import Timer from "./Timer";

const Test = ({ testData, fullName, formEmail }) => {
	const { data: user, status } = useSession();


	const [questions, setQuestions] = useState([]);
	const [questionsIds, setQuestionIds] = useState([]);
	const [question, setQuestion] = useState({});
	const [results, setResults] = useState([]);

	const [answers, setAnswers] = useState([]);
	const [fetchStatus, setFetchStatus] = useState(false);
	const [resultsFetched, setResultsFetched] = useState(false);
	const [timeRunOut, setTimeRunOut] = useState(false);
	const [timeLeft, setTimeLeft] = useState("");
	const [testState, setTestState] = useState({ index: 0, maxIndex: 0 });
	const [questionsState, setQuestionsState] = useState([]);


	const [showModal, setShowModal] = useState(false);
	const [warnings, setWarnings] = useState(0);

	const getShuffledArr = (arr) => {
		if (arr.length === 1) {
			return arr;
		}
		const rand = Math.floor(Math.random() * arr.length);
		return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
	};


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

		if (showModal !== true) {
			setWarnings(warnings + 1);
			setShowModal(true);
		}

	};

	// fetching questions
	useEffect(() => {
		if (status === "loading") return;
		let questions_ids = [];
		let shuffledData = [];
		const fetchStatus = _fetch(`${absoluteUrlPrefix}/api/test/${testData.test_id}/questions`, { method: "GET" })
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if(data.status === 200)
				shuffledData = getShuffledArr(data.data);
				for(let i of shuffledData){
					questions_ids.push(i.question_id);
				}
				console.log(questions_ids, shuffledData);
				setQuestions(shuffledData);
				setQuestionIds(questions_ids);
			});
>>>>>>> Stashed changes
	}, [status]);

	useEffect(() => {
<<<<<<< Updated upstream
		console.log(JSON.stringify(questions));
		if (questions.length > 0) {
			const fetched = _fetch(`${absoluteUrlPrefix}/api/test/getQuestionAnswers/`, { method: 'POST', body: JSON.stringify(questions) })
=======
		if (questionsIds.length > 0  && !fetchStatus) {
			console.log(JSON.stringify(questionsIds))
			const fetchStatus = _fetch(`${absoluteUrlPrefix}/api/question/${JSON.stringify(questionsIds)}/answers`, { method: "GET"})
>>>>>>> Stashed changes
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					setAnswers(data);
				});
		}
<<<<<<< Updated upstream
		setTestState({ ...testState, maxIndex: questions.length - 1 });
	}, [questions]);
=======
	}, [questionsIds]);
>>>>>>> Stashed changes

	useEffect(() => {
<<<<<<< Updated upstream
		if (answers.length > 0) {
			setFetched(true);
		}
	}, [answers]);

=======
		if (answers.length > 0 && !fetchStatus) {
			console.log(answers);
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
		if (results.length ===0) return;
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
				user_id: user ? user.id : null,
				user_email: user ? user.email : formEmail,
				user_full_name: user ? user.user.name : fullName,
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

>>>>>>> Stashed changes
	const handleTestStateIncrement = () => {
		const { index, maxIndex } = testState;
		if (index === maxIndex) return;
		setTestState({ ...testState, index: index + 1 });
	};

	const handleTestStateDecrement = () => {
		const { index, maxIndex } = testState;
		if (index === 0) return;
		setTestState({ ...testState, index: index - 1 });
	};

	console.log(questions);
	return (
<<<<<<< Updated upstream
		<div className='flex flex-col max-w-lg'>
			{questions
				.filter((question, index) => {
					return index === testState.index;
				})
				.map((question) => {
					return (
						<>
							<Question key={question.question_id} question={question} id={testState.index + 1} numberOfQuestions={testState.maxIndex + 1}>
								{answers
									.filter((answer) => {
										return answer.question_id === question.question_id;
									})
									.map((answer, index, mappedArray) => {
										console.log(index, mappedArray.length);
										return (
											<>
												{index === 0 ? <div className='divider max-w-sm after:bg-gray-600/40 before:bg-gray-600/40'></div> : null}
												<Answer key={answer.answer_id} answer={answer} index={index} />
												{index !== mappedArray.length - 1 ? <div className='divider max-w-sm after:bg-gray-600/40 before:bg-gray-600/40'></div> : null}
											</>
										);
									})}
							</Question>
						</>
					);
				})}

			{/* show question */}

			<div className='self-center space-x-5 my-2'>
				{testState.index === 0 ? (
					<button className='btn' disabled>
						Poprzedni
					</button>
				) : (
					<button className='btn bg-green-500 border-0' onClick={(e) => handleTestStateDecrement()}>
						Poprzedni
					</button>
				)}
				{testState.index === testState.maxIndex ? (
					<button className='btn' disabled>
						Następny
					</button>
				) : (
					<button className='btn bg-green-500 border-0' onClick={(e) => handleTestStateIncrement()}>
						Następny
					</button>
=======
		<>
			<div className="flex flex-col max-w-lg">
				{!resultsFetched && !timeRunOut && fetchStatus ? (
					<>
						{!timeRunOut && fetchStatus && (
							<>
								<>
									<Timer
										timeLeft={timeLeft}
										setTimeLeft={setTimeLeft}
										testState={testState}
										questions={questions}
										handleFinishTest={handleFinishTest}
										setTestState={setTestState}
										setQuestions={setQuestions}
									/>

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
					results.length > 0 && <ResultsCard results={results} testName={testData.test_name} />
>>>>>>> Stashed changes
				)}
			</div>

			<button className='btn btn-outline self-center'>Zakończ </button>
		</div>
	);
};

export default Test;
