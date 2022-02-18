import Layout from 'components/Layout/Layout';
import { absoluteUrlPrefix } from 'next.config';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Question from 'components/Layout/LoggedContent/NewTest/Question/Question';
import crypto from 'crypto';

function newTest() {
	const test_id = v4();
	const code = crypto.randomBytes(8).toString('hex');
	const [test, setTest] = useState({
		id: test_id,
		date: '',
		name: '',
		code: code,
		total_points: 0,
		type: 'PUBLIC',
	});
	const [questions, setquestions] = useState([]);
	const [answers, setanswers] = useState([]);

	useEffect(() => {
		console.log([...Object.values(test)]);
	}, [test]);
	async function handleQuestionsUpdate(question) {
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
		const res = fetch(`${absoluteUrlPrefix}/api/test/addTest`, { method: 'POST', body: body });
	}

	return (
		<Layout>
			<div className='flex flex-1 flex-col items-center justify-center pt-5 md:p-5'>
				<div className='card bg-base-200 w-full max-w-sm p-5 md:max-w-[600px] md:p-10'>
					<h2 className='text-2xl'>Nowy test</h2>
					{/* test name */}
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>Nazwa testu</span>
						</label>
						<input type='text' placeholder='Podsumowanie działu:' className='input' onChange={(e) => setTest({ ...test, name: e.target.value })} />
					</div>
					{/* test date */}
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>Data zakończenia testu</span>
						</label>
						<input type='datetime-local' className='input' onChange={(e) => setTest({ ...test, date: e.target.value })} />
					</div>
					{/* test type */}
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>Typ testu</span>
						</label>
						<select defaultValue='PUBLIC' className='select select-bordered w-full max-w-xs' onChange={(e) => setTest({ ...test, type: e.target.value })}>
							<option value='PUBLIC'>Publiczny</option>
							<option value='PRIVATE'>Prywatny</option>
						</select>
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
					Dodaj Pytanie
				</button>
				<button onClick={handleSubmit} className='btn btn fixed bottom-1 right-1 m-4 bg-green-500'>
					Wyślij
				</button>
			</div>
		</Layout>
	);
}

export default newTest;
