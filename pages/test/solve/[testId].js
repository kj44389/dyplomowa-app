import Layout from 'components/Layout/Layout';
import Question from 'components/Layout/LoggedContent/SolveTest/Test/Question';
import NameEmailForm from 'components/Layout/LoggedContent/SolveTest/CodeNameForm/NameEmailForm';
import SolveTest from 'components/Layout/LoggedContent/SolveTest/SolveTest';
import Answer from 'components/Layout/LoggedContent/SolveTest/Test/Answer';
import ResultsCard from 'components/Layout/LoggedContent/SolveTest/Test/ResultsCard';
import Timer from 'components/Layout/LoggedContent/SolveTest/Test/Timer';
import _fetch from 'isomorphic-fetch';
import { getSession, useSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { useEffect, useState } from 'react';
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
	const testData = await _fetch(`${absoluteUrlPrefix}/api/test/${testId}`, { method: 'GET' }).then((res) => {
		return res.json();
	});

	let questionsIds = [];
	let shuffledData = [];

	const testQuestions = await _fetch(`${absoluteUrlPrefix}/api/test/${testId}/questions`, { method: 'GET' })
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
	let testAnswers;
	if (questionsIds.length > 0 && testData) {
		testAnswers = await _fetch(`${absoluteUrlPrefix}/api/question/${JSON.stringify(questionsIds)}/answers`, { method: 'GET' }).then((res) => {
			return res.json();
		});
	}
	return {
		props: {
			testData: testData,
			testQuestions: testQuestions,
			fetchedIds: questionsIds,
			testAnswers: testAnswers,
			fullName: session?.name,
			Email: session?.email,
		},
	};
}

const solve = ({ testData, testQuestions, testAnswers, fetchedIds, fullName, Email }) => {
	const { data: user, status } = useSession();

	const [questions, setQuestions] = useState(testQuestions);
	const [questionsIds, setQuestionIds] = useState(fetchedIds);
	const [question, setQuestion] = useState({});
	const [results, setResults] = useState([]);

	const [answers, setAnswers] = useState(testAnswers);
	const [resultsFetched, setResultsFetched] = useState(false);
	const [timeRunOut, setTimeRunOut] = useState(false);
	const [timeLeft, setTimeLeft] = useState('');
	const [testState, setTestState] = useState({ index: 0, maxIndex: 0 });
	const [questionsState, setQuestionsState] = useState([]);

	const [showModal, setShowModal] = useState(false);
	const [warnings, setWarnings] = useState(0);

	useEffect(() => {
		window.addEventListener('blur', () => setShowModal(true));
	}, []);

	useEffect(() => {
		console.log('zmiana');
		if (showModal === true) {
			if (warnings === 2) {
				window.removeEventListener('blur', () => null);
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

	useEffect(() => {
		if (answers.length > 0) {
			setTestState({ ...testState, maxIndex: questions.length - 1 });
			setTimeLeft(questions[0].question_time);

			for (let answer of answers) {
				const { answer_id, question_id } = answer;
				setQuestionsState((prev) => [...prev, { question_id: question_id, answer_id: answer_id, picked: false }]);
			}
		}
	}, [answers]);

	useEffect(() => {
		setQuestion(questions[testState.index]);
	}, [testState]);

	useEffect(() => {
		if (results.length === 0) return;
		setResultsFetched(true);
	}, [results]);

	const handleFinishTest = () => {
		setTimeRunOut(true);

		_fetch(`${absoluteUrlPrefix}/api/test/results`, {
			method: 'POST',
			headers: { contentType: 'application/json' },
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

	const handleTestStateIncrement = () => {
		const { index, maxIndex } = testState;
		if (index === maxIndex) return;

		let tmp = questions;
		tmp[index].question_time = timeLeft;
		setQuestions(tmp);
		setTestState({ ...testState, index: index + 1 });
		setTimeLeft(questions[index + 1].question_time);
	};

	const handleTestStateDecrement = () => {
		const { index, maxIndex } = testState;
		if (index === 0) return;
		let tmp = questions;
		tmp[index].question_time = timeLeft;
		setQuestions(tmp);
		setTestState({ ...testState, index: index - 1 });
		setTimeLeft(questions[index - 1].question_time);
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
												return answer.question_id === question?.question_id;
											})
											.map((answer, index, mappedArray) => {
												return (
													<div key={v4()}>
														{index === 0 ? <div className='divider max-w-sm before:bg-gray-600/40 after:bg-gray-600/40'></div> : null}

														<Answer
															key={answer.answer_id}
															answer={answer}
															index={index}
															disabled={question?.question_time === '00:00:00' ? true : false}
															picked={questionsState[questionsState.findIndex((state) => state.answer_id === answer.answer_id)]?.picked}
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
											Poprzedni
										</button>
									) : (
										<button className='btn border-0 bg-green-500' onClick={(e) => handleTestStateDecrement()}>
											Poprzedni
										</button>
									)}
									{testState.index === testState.maxIndex ? (
										<button className='btn' disabled>
											Następny
										</button>
									) : (
										<button className='btn border-0 bg-green-500' onClick={(e) => handleTestStateIncrement()}>
											Następny
										</button>
									)}
								</div>
							</>
						)}
						{timeRunOut && <h2 className='my-3 text-lg'>Czas się skończył.</h2>}
						<button className='btn  btn-sm btn-outline mx-auto self-center' onClick={(e) => handleFinishTest()}>
							Zakończ
						</button>
					</div>
				) : (
					results.length > 0 && <ResultsCard results={results} testName={testData.test_name} />
				)}
			</div>
		</Layout>
	);
};

export default solve;
