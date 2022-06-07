import Layout from 'components/Layout/Layout';
import { absoluteUrlPrefix } from 'next.config';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Question from 'components/Layout/LoggedContent/NewTest/Question/Question';
import crypto from 'crypto';
import moment from 'moment';
import router from 'next/router';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
	const ifEdit = context.query?.edit;
	const testId = context.query?.test_id;
	const test_id = v4();
	const code = crypto.randomBytes(8).toString('hex');
	const emptyTest = {
		test_id: test_id,
		test_date: '',
		test_name: '',
		test_code: code,
		test_type: 'PUBLIC',
		emails: '',
	};
	if (!ifEdit && !testId)
		return {
			props: {
				fetched_test: emptyTest,
				fetched_questions: [],
				fetched_answers: [],
				error: false,
			},
		};
	const session = await getSession(context);
	const testData = await fetch(`${absoluteUrlPrefix}/api/test/${testId}`).then((response) => response.json());
	if (session.id != testData[0].test_creator || testData.length === 0)
		return {
			props: {
				fetched_test: emptyTest,
				fetched_questions: [],
				fetched_answers: [],
				error: true,
			},
		};
	const questionsData = await fetch(`${absoluteUrlPrefix}/api/questions?test_id=${testId}`).then((response) => response.json());
	console.log(questionsData);
	const questionsIds = [];
	let index = 1;
	for (let i of questionsData) {
		questionsIds.push(i.question_id);
		i.id = index;
		++index;
	}
	const answersData = await fetch(`${absoluteUrlPrefix}/api/answers/${JSON.stringify(questionsIds)}`).then((response) => response.json());
	index = 1;
	for (let i of answersData) {
		i.id = index;
		++index;
	}
	const emails = await fetch(`${absoluteUrlPrefix}/api/participants/${testId}`)
		.then((response) => response.json())
		.then((data) => data.data);
	testData[0].emails = emails.join(',');

	return {
		props: {
			fetched_test: testData[0] || emptyTest,
			fetched_questions: questionsData || [],
			fetched_answers: answersData || [],
			error: false,
		},
	};
}

function NewTest({ fetched_test, fetched_answers, fetched_questions, error }) {
	const [test, setTest] = useState(fetched_test);
	const [questions, setquestions] = useState(fetched_questions);
	const [answers, setanswers] = useState(fetched_answers);
	const router = useRouter();
	// useEffect(() => {
	// 	console.log([...Object.values(test)]);
	// 	console.log(test);
	// }, [test]);

	async function handleQuestionsUpdate(question) {
		// console.log(questions);
		console.log(questions[question.id - 1]);
		questions[question.id - 1] = question;
		setquestions((prevVal) => [...prevVal]);
	}
	async function handleAnswersUpdate(answer) {
		answers[answer.id - 1] = answer;
		setanswers((prevVal) => [...prevVal]);
	}
	function handleAddQuestion() {
		setquestions([
			...questions,
			{
				id: questions.length + 1,
				question_id: v4(),
				question_name: '',
				question_time: '',
				question_type: 'text_one',
				question_score: 0,
				question_addon: '',
				question_addon_src: '',
			},
		]);
	}
	function handleAddAnswer(question_id) {
		setanswers([
			...answers,
			{
				id: answers.length + 1,
				answer_id: v4(),
				question_id: question_id,
				answer_name: '',
				answer_type: 'text_one',
				answer_addon: '',
				answer_addon_src: '',
				correct: '',
			},
		]);
	}
	async function handleSubmit() {
		const body = JSON.stringify({
			questions: questions,
			answers: answers,
			test: test,
		});
		console.log(answers);
		if (router.query.edit) {
			console.log('edit');
			const res = fetch(`${absoluteUrlPrefix}/api/test/${test.test_id}`, { method: 'PATCH', body: body });
		} else {
			const res = fetch(`${absoluteUrlPrefix}/api/test/${test.test_id}`, { method: 'POST', body: body });
		}
		router.push('/tests/show');
	}

	return (
		<>
			{!error ? (
				<Layout>
					<div className='flex flex-1 flex-col items-center justify-center pt-5 md:p-5'>
						<div className='card bg-base-200 w-full max-w-sm p-5 md:max-w-[600px] md:p-10'>
							<h2 className='text-2xl'>New Test</h2>
							{/* test name */}
							<div className='form-control'>
								<label className='label'>
									<span className='label-text'>Test Name</span>
								</label>
								<input
									type='text'
									defaultValue={test.test_name || ''}
									placeholder='Podsumowanie działu:'
									className='input'
									onChange={(e) => setTest({ ...test, test_name: e.target.value })}
								/>
							</div>
							{/* test date */}
							<div className='form-control'>
								<label className='label'>
									<span className='label-text'>Test expiring date</span>
								</label>
								<input
									type='datetime-local'
									defaultValue={moment(test.test_date).format('YYYY-MM-DDTHH:mm') || 'YYYY-MM-DDTHH:mm'}
									className='input'
									onChange={(e) => setTest({ ...test, test_date: e.target.value })}
								/>
							</div>
							{/* test type */}
							<div className='form-control'>
								<label className='label'>
									<span className='label-text'>Test Type</span>
								</label>
								<select
									defaultValue={test.test_type || 'PUBLIC'}
									className='select select-bordered w-full max-w-xs'
									onChange={(e) => setTest({ ...test, test_type: e.target.value })}>
									<option value='PUBLIC'>Public</option>
									<option value='PRIVATE'>Private</option>
								</select>
							</div>
							<div className='form-control'>
								<label className='label'>
									<span className='label-text'>Participants Emails (splited with comma)</span>
								</label>
								<input
									type='text'
									defaultValue={test.emails || ''}
									placeholder='Type emails splited with comma here'
									className='input'
									onChange={(e) => setTest({ ...test, emails: e.target.value })}
								/>
							</div>
						</div>

						{questions.length > 0 && (
							<div className='card bg-base-200 mt-3 mb-3 w-full max-w-sm p-1 md:max-w-[600px] md:p-10'>
								{questions.map((question) => {
									return (
										<Question
											props={{
												questions: questions,
												question: question,
												setquestions: handleQuestionsUpdate,
												answers: answers,
												addAnswer: handleAddAnswer,
												setanswers: handleAnswersUpdate,
											}}
											key={question.id}
										/>
									);
								})}
							</div>
						)}

						<button onClick={handleAddQuestion} className='btn btn-outline btn-sm m-4'>
							Add Question
						</button>
						<button onClick={handleSubmit} className='btn btn fixed bottom-1 right-1 m-4 bg-green-500'>
							Submit
						</button>
					</div>
				</Layout>
			) : (
				<h1>Error! Taki test nie istnieje, lub nie masz uprawnień do jego edycji!</h1>
			)}
		</>
	);
}

export default NewTest;
