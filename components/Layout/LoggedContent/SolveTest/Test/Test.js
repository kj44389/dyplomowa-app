import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";
import useTimer from "lib/useTimer";
import { v4 } from "uuid";

import Answer from "./Answer";
import Question from "./Question";

const Test = ({ testData }) => {
	const { status } = useSession();

	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [fetchStatus, setFetchStatus] = useState(false);
	const [timeRunOut, setTimeRunOut] = useState(false);
	const [testState, setTestState] = useState({
		index: 0,
		maxIndex: 0,
	});

	const [questionsState, setQuestionsState] = useState([]);

	let timer = null;
	const [timeLeft, setTimeLeft] = useState("");
	const calculateTimeLeft = (passedTime) => {
		const timeElements = passedTime.split(":");
		let minutes = parseInt(timeElements[0]);
		let seconds = parseInt(timeElements[1]);

		if (seconds !== 0 || minutes !== 0) {
			seconds === 0 ? ((seconds = 59), (minutes = minutes - 1)) : (seconds = seconds - 1);
		}
		return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}:00`;
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
					setQuestions(data);
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
					setAnswers(data);
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

	//timer
	useEffect(() => {
		const { index } = testState;
		let nextQuestionIndex = 0;
		if (timeLeft === "" || timer != null) return;
		let localTimeLeft = calculateTimeLeft(questions[index].question_time);

		if (timeLeft === "00:00:00") {
			nextQuestionIndex = questions.findIndex((question) => question.question_time !== "00:00:00");
			if (nextQuestionIndex < 0) {
				setTimeRunOut(true);
				return;
			}

			setTestState((prev) => ({ ...prev, index: nextQuestionIndex }));
			localTimeLeft = calculateTimeLeft(questions[nextQuestionIndex].question_time);
		}

		timer = setTimeout(() => {
			//update time left
			setTimeLeft(localTimeLeft);
		}, 1000);

		if (nextQuestionIndex === 0) {
			questions[index].question_time = localTimeLeft;
		} else {
			questions[nextQuestionIndex].question_time = localTimeLeft;
		}

		setQuestions((prev) => [...questions]);
		return () => {
			clearTimeout(timer);
			timer = null;
		};
	}, [timeLeft]);

	useEffect(() => {
		console.log(questionsState);
	}, [questionsState]);

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
		setTestState({ ...testState, index: index + 1 });
	};

	const handleTestStateDecrement = () => {
		const { index } = testState;
		if (index === 0) return;
		setTestState({ ...testState, index: index - 1 });
	};

	return (
		<div className="flex flex-col max-w-lg">
			{!timeRunOut && (
				<>
					{questions
						.filter((question, index) => {
							return index === testState.index;
						})
						.map((question) => {
							return (
								<>
									<Question
										key={question.question_id}
										question={question}
										id={testState.index + 1}
										numberOfQuestions={testState.maxIndex + 1}
									>
										{answers
											.filter((answer) => {
												return answer.question_id === question.question_id;
											})
											.map((answer, index, mappedArray) => {
												return (
													<>
														{index === 0 ? (
															<div className="divider max-w-sm after:bg-gray-600/40 before:bg-gray-600/40"></div>
														) : null}
														<Answer
															key={answer.answer_id}
															answer={answer}
															time={question.question_time}
															index={index}
															question_id={question.question_id}
															onClick={handleQuestionStateChange}
														/>
														{index !== mappedArray.length - 1 ? (
															<div className="divider max-w-sm after:bg-gray-600/40 before:bg-gray-600/40"></div>
														) : null}
													</>
												);
											})}
									</Question>
								</>
							);
						})}

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
			<button className="btn btn-sm btn-outline self-center">Zakończ </button>
		</div>
	);
};

export default Test;
