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
	}, [status]);

	useEffect(() => {
		console.log(JSON.stringify(questions));
		if (questions.length > 0) {
			const fetched = _fetch(`${absoluteUrlPrefix}/api/test/getQuestionAnswers/`, { method: 'POST', body: JSON.stringify(questions) })
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					setAnswers(data);
				});
		}
		setTestState({ ...testState, maxIndex: questions.length - 1 });
	}, [questions]);

	useEffect(() => {
		if (answers.length > 0) {
			setFetched(true);
		}
	}, [answers]);

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
				)}
			</div>

			<button className='btn btn-outline self-center'>Zakończ </button>
		</div>
	);
};

export default Test;
