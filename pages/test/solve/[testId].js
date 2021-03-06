import Layout from 'components/Layout/Layout';
import Question from 'components/Layout/LoggedContent/SolveTest/Test/Question';
import NameEmailForm from 'components/Layout/LoggedContent/SolveTest/CodeNameForm/NameEmailForm';
import WarningModal from 'components/WarningModal/WarningModal';

import Answer from 'components/Layout/LoggedContent/SolveTest/Test/Answer';
import ResultsCard from 'components/Layout/LoggedContent/SolveTest/Test/ResultsCard';
import Timer from 'components/Layout/LoggedContent/SolveTest/Test/Timer';
import _fetch from 'isomorphic-fetch';
import { getSession, useSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { useEffect, useState, useCallback } from 'react';
import { v4 } from 'uuid';

const getShuffledArr = (arr) => {
	if (arr.length === 1) {
		return arr;
	}
	const rand = Math.floor(Math.random() * arr.length);
	return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
};

export async function getServerSideProps(context) {
	const session = await getSession(context);

	const testId = context.query.testId;

	const testData = await _fetch(`${absoluteUrlPrefix}/api/v2/test/${testId}`, {
		method: 'GET',
	}).then((res) => {
		return res.json();
	});

	let questionsIds = [];
	let shuffledData = [];

	const testQuestions = await _fetch(`${absoluteUrlPrefix}/api/v2/test/${testId}/questions`, { method: 'GET' })
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (data.status === 200) shuffledData = getShuffledArr(data.data);
			for (let i of shuffledData) {
				questionsIds.push(i.question_id);
			}
			return shuffledData;
		});
	let testAnswers = [];

	if (questionsIds.length > 0 && testData?.data) {
		testAnswers = await _fetch(`${absoluteUrlPrefix}/api/v2/answers/${JSON.stringify(questionsIds)}`, {
			method: 'GET',
		}).then((res) => {
			return res.json();
		});
	}
	return {
		props: {
			testData: testData.data[0],
			testQuestions: testQuestions,
			fetchedIds: questionsIds,
			testAnswers: testAnswers.data,
			fullName: session?.name || `${context.query.name} ${context.query.surname}`,
			Email: session?.email || `${JSON.parse(context.query.email)}`,
		},
	};
}

const Solve = ({ testData, testQuestions, testAnswers, fullName, Email }) => {
	const { data: user } = useSession();
	const [questions, setQuestions] = useState(testQuestions);
	const [question, setQuestion] = useState({});
	const [results, setResults] = useState([]);

	const [answers, setAnswers] = useState(testAnswers);
	const [resultsFetched, setResultsFetched] = useState(false);
	const [timeRunOut, setTimeRunOut] = useState(false);
	const [timeLeft, setTimeLeft] = useState('');
	const [testState, setTestState] = useState({ index: 0, maxIndex: 0 });
	const [questionsState, setQuestionsState] = useState([]);
	const [finishStatus, setFinishStatus] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [warnings, setWarnings] = useState(0);

	useEffect(() => {
		if (answers.length > 0) {
			setTestState({ ...testState, maxIndex: questions.length - 1 });
			setTimeLeft(questions[0].question_time);

			for (let answer of answers) {
				const answer_id = answer?.answer?.answer_id;
				const question_id = answer?.question_id;
				setQuestionsState((prev) => [
					...prev,
					{
						question_id: question_id,
						answer_id: answer_id,
						picked: false,
					},
				]);
			}
		}
	}, []);

	useEffect(() => {
		setQuestion(questions[testState.index]);
	}, [testState]);

	useEffect(() => {
		if (results.length === 0) return;
		setResultsFetched(true);
	}, [results]);

	const handleModalClose = () => {
		setShowModal(false);
	};

	const handleFinishTest = async () => {
		setTimeRunOut(true);
		setFinishStatus(true);
		window.addEventListener('blur', () => {
			setShowModal(false);
		});
		await _fetch(`${absoluteUrlPrefix}/api/v2/test/results`, {
			method: 'POST',
			headers: { contentType: 'application/json' },
			body: JSON.stringify({
				questions: questions,
				answers: answers,
				questionsState: questionsState,
				test_id: testData.test_id,
				user_id: user ? user.id : null,
				user_email: user ? user.email : Email,
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

	useEffect(() => {
		if (showModal == true && finishStatus == false) {
			setWarnings((prevState) => prevState + 1);
		}
	}, [showModal, finishStatus]);

	useEffect(() => {
		if (warnings === 0) {
			window.addEventListener('blur', () => {
				setShowModal(true);
			});
		}
		if (warnings >= 3 && finishStatus === false) {
			setShowModal(false);
			handleFinishTest();
		}
	}, [warnings]);

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
		let nextAvailableIndex = index + 1;
		if (questions[index + 1].question_time === '00:00:00') {
			nextAvailableIndex = questions.findIndex((question, localIndex) => localIndex > index && question.question_time != '00:00:00');
			if (nextAvailableIndex === -1) nextAvailableIndex = index;
		}
		let tmp = questions;
		tmp[index].question_time = timeLeft;
		setQuestions(tmp);
		setTestState({ ...testState, index: nextAvailableIndex });
		setTimeLeft(questions[nextAvailableIndex].question_time);
	};

	const handleTestStateDecrement = () => {
		const { index, maxIndex } = testState;
		if (index === 0) return;
		let nextAvailableIndex = index - 1;
		if (questions[index - 1].question_time === '00:00:00') {
			nextAvailableIndex = questions.findIndex((question, localIndex) => localIndex < index && question.question_time !== '00:00:00');
			if (nextAvailableIndex === -1) nextAvailableIndex = index;
		}
		let tmp = questions;
		tmp[index].question_time = timeLeft;
		setQuestions(tmp);
		setTestState({ ...testState, index: nextAvailableIndex });
		setTimeLeft(questions[nextAvailableIndex].question_time);
	};

	return (
		<Layout>
			<div className='mx-auto flex max-w-lg flex-col py-6'>
				{!resultsFetched && !timeRunOut ? (
					<div className='flex flex-col'>
						{!timeRunOut && (
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
								<>
									<Question key={question?.question_id} id={testState.index + 1} numberOfQuestions={testState.maxIndex + 1} question={question}>
										{answers
											.filter((answer) => {
												return answer?.question_id === question?.question_id;
											})
											.map((answer, index, mappedArray) => {
												return (
													<div key={v4()}>
														{index === 0 ? <div className='divider max-w-sm before:bg-gray-600/40 after:bg-gray-600/40'></div> : null}

														<Answer
															key={answer?.answer?.answer_id}
															answer={answer?.answer}
															question_id={question.question_id}
															index={index}
															disabled={question?.question_time === '00:00:00' ? true : false}
															picked={
																questionsState[questionsState.findIndex((state) => state.answer_id === answer?.answer.answer_id)]
																	?.picked
															}
															onClick={handleQuestionStateChange}
														/>

														{index !== mappedArray.length - 1 ? (
															<div className='divider max-w-sm before:bg-gray-600/40 after:bg-gray-600/40'></div>
														) : null}
													</div>
												);
											})}
									</Question>
								</>

								<div className='mx-auto  my-2 space-x-5 self-center'>
									{testState.index === 0 ? (
										<button className='btn' disabled>
											Prev
										</button>
									) : (
										<button className='btn border-0 bg-green-500' onClick={(e) => handleTestStateDecrement()}>
											Prev
										</button>
									)}
									{testState.index === testState.maxIndex ? (
										<button className='btn' disabled>
											Next
										</button>
									) : (
										<button className='btn border-0 bg-green-500' onClick={(e) => handleTestStateIncrement()}>
											Next
										</button>
									)}
								</div>
							</>
						)}
						{timeRunOut && <h2 className='my-3 text-lg'>Time run out.</h2>}
						<button className='btn  btn-sm btn-outline mx-auto self-center' onClick={(e) => handleFinishTest()}>
							End
						</button>
					</div>
				) : (
					results.length > 0 && <ResultsCard results={results} testName={testData.test_name} />
				)}
			</div>
			{showModal && <WarningModal handleModalClose={handleModalClose} />}
		</Layout>
	);
};

export default Solve;
