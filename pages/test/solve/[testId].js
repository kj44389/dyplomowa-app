import Layout from 'components/Layout/Layout';
import Question from 'components/Layout/LoggedContent/SolveTest/Test/Question';
import NameEmailForm from 'components/Layout/LoggedContent/SolveTest/CodeNameForm/NameEmailForm';

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
		window.addEventListener('blur', () => {
			handleModalOpen();
		});
	}, []);

	useEffect(() => {
		if (showModal === true) setWarnings(warnings + 1);
	}, [showModal, warnings]);

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

	const handleModalOpen = () => {
		setShowModal(true);
	};

	const handleModalClose = () => {
		setShowModal(false);
	};

	const handleFinishTest = async () => {
		setTimeRunOut(true);
		setFinishStatus(true);
		window.removeEventListener('blur', () => null);
		console.log(
			'json',
			JSON.stringify({
				questions: questions,
				answers: answers,
				questionsState: questionsState,
				test_id: testData.test_id,
				user_id: user ? user.id : null,
				user_email: user ? user.email : Email,
				user_full_name: user ? user.user.name : fullName,
			})
		);

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
		// TODO: fix a bug - when modal is visible there is react loop in hooks.
		if (warnings >= 3 && finishStatus === false) {
			window.removeEventListener('blur', () => null);
			setShowModal(false);
			// handleFinishTest();
			setFinishStatus(true);
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
			{showModal && (
				<div className='h-modal fixed top-32 left-1/2 z-50 -translate-x-1/2  items-center justify-center overflow-y-auto overflow-x-hidden sm:h-full ' id='popup-modal'>
					<div className='relative h-full w-full max-w-md px-4 md:h-auto'>
						<div className='relative rounded-lg bg-white shadow dark:bg-gray-700'>
							<div className='flex justify-end p-2'>
								<button
									type='button'
									className='ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
									data-modal-toggle='popup-modal'
									onClick={(e) => {
										handleModalClose();
									}}>
									<svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
										<path
											fillRule='evenodd'
											d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
											clipRule='evenodd'></path>
									</svg>
								</button>
							</div>

							<div className='p-6 pt-0 text-center'>
								<svg
									className='mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-500'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
								</svg>
								<h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
									During test You can`&apos`t use external help. Please finish your test by yourself or Your test will fail.
								</h3>
								<button
									data-modal-toggle='popup-modal'
									type='button'
									className='mr-2 inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300'
									onClick={(e) => {
										handleModalClose();
									}}>
									I`&apos`m understand
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default Solve;
