import { absoluteUrlPrefix } from 'next.config';
import { useEffect, useState, useCallback } from 'react';
import Answer from './Answer/Answer';
import Question_addons from './Question_addons';
import ReactPlayer from 'react-player';
import _fetch from 'isomorphic-fetch';
import Image from 'next/image';
import { v4 } from 'uuid';

function Question({ props }) {
	const [question, setquestion] = useState(props.question);
	const [uploadingStatus, setUploadingStatus] = useState('pending');
	const answers = props.answers;

	//update questions state
	useEffect(() => {
		console.log('update');
		props.setquestions(question);
	}, [question, props]);

	const handleQuestionChange = useCallback(
		async (what_changing, value) => {
			question[`${what_changing}`] = value;
			setquestion({ ...question, [what_changing]: value });
		},
		[question]
	);
	// FILE UPLOAD execution
	const handleAddFile = useCallback(
		async (form) => {
			const res = await _fetch(`${absoluteUrlPrefix}/api/test/uploadFile?`, {
				method: 'POST',
				body: form,
			});
			let { data, filepath } = await res.json();
			filepath = filepath.replaceAll('\\', '/');
			handleQuestionChange('question_addon_src', filepath);
		},
		[handleQuestionChange]
	);

	// FILE UPLOAD preparing
	useEffect(() => {
		let reader = window.FileReader;
		if (!question.question_addon) return;
		const form = new FormData();
		setUploadingStatus('pending');

		if (question.question_type === 'with_youtube') {
			handleQuestionChange('question_addon_src', question.question_addon);
		} else {
			reader.readAsDataURL(question.question_addon);
			if (question.question_type === 'with_audio') {
				reader.onload = (e) => {
					handleQuestionChange('question_addon_src', reader.result);
					form.append('audio', question.question_addon);
					handleAddFile(form);
				};
			}
			if (question.question_type === 'with_image') {
				reader.onload = (e) => {
					handleQuestionChange('question_addon_src', reader.result);
					form.append('image', question.question_addon);
					handleAddFile(form);
				};
			}
		}
		// console.log('question_addon', question.question_addon, question.question_addon_src, question);
	}, [question.question_addon, handleAddFile, handleQuestionChange, question.question_type]);

	// // reseting src after type change
	// useEffect(() => {
	// 	setquestion({ ...question, question_addon_src: '', question_addon: '' });
	// }, [question.question_type]);

	//marking upload as done
	useEffect(() => {
		setUploadingStatus('done');
		handleQuestionChange('question_addon', null);
	}, [question.question_addon_src, handleQuestionChange]);

	function renderQuestionSwitch(type) {
		switch (type) {
			case 'text_one':
				return;
			case 'text_many':
				return;
			case 'with_audio':
				return <Question_addons props={{ type: 'audio', handleQuestionChange: handleQuestionChange, value: question.question_addon_src || '' }} />;
			case 'with_image':
				return <Question_addons props={{ type: 'image', handleQuestionChange: handleQuestionChange, value: question.question_addon_src || '' }} />;
			case 'with_youtube':
				return <Question_addons props={{ type: 'youtube', handleQuestionChange: handleQuestionChange, value: question.question_addon_src || '' }} />;
		}
	}
	//helper function

	return (
		<div className='indicator mt-16 mb-12 flex h-auto w-full flex-col space-y-6'>
			<div className='indicator-item indicator-top-left indicator-start badge badge-md ml-10 translate-x-[-25%] rounded-bl-none rounded-tl-none bg-green-500 md:ml-0'>
				Question {question.id}
			</div>
			<div className='form-control'>
				<label className='label'>
					<span className='label-text'>Question Type</span>
				</label>
				<select onChange={(e) => handleQuestionChange('question_type', e.target.value)} defaultValue={question.question_type || 'text_one'} className='select select-bordered w-full '>
					{/* <select onChange={(e) => QuestionChange(question.question_id, 'question_type', e.target.value)} defaultValue='text_one' className='select select-bordered w-full '> */}
					<option value='text_one'>Single choice</option>
					<option value='text_many'>Multiple choice</option>
					<option value='with_audio'>With audio </option>
					<option value='with_image'>With image</option>
					<option value='with_youtube'>With video (YouTube)</option>
				</select>
			</div>

			<div className='flex items-center justify-center'>
				{question.question_addon_src !== '' && uploadingStatus !== 'pending' && question.question_type == 'with_image' && (
					<Image alt='question image' src={`/${question.question_addon_src}`} className='max-w-sm' />
				)}
				{question.question_addon_src !== '' && uploadingStatus !== 'pending' && question.question_type == 'with_audio' && (
					<ReactPlayer url={`/${question.question_addon_src}`} height={70} controls />
				)}
				{question.question_addon_src !== '' && uploadingStatus !== 'pending' && question.question_type == 'with_youtube' && <ReactPlayer url={question.question_addon_src} controls />}
			</div>
			{renderQuestionSwitch(question.question_type)}
			{/* question name */}
			<div className='form-control'>
				<label className='label'>
					<span className='label-text'>Question</span>
				</label>
				<textarea
					className='textarea h-24'
					placeholder='How many people live on Earth?'
					defaultValue={question.question_name || ''}
					onChange={(e) => {
						handleQuestionChange('question_name', e.target.value);
					}}></textarea>
			</div>
			{/* queston time and points */}
			<div className='form-control flex w-full flex-col md:flex-row md:space-x-2'>
				<div className='flex w-full flex-col md:w-1/2'>
					<label className='label'>
						<span className='label-text'>Question Time (s)</span>
					</label>
					<input
						type='time'
						className='input'
						defaultValue={question.question_time || ''}
						onChange={(e) => {
							handleQuestionChange('question_time', e.target.value);
						}}
					/>
				</div>
				<div className='flex w-full flex-col md:w-1/2'>
					<label className='label'>
						<span className='label-text'>Question points</span>
					</label>
					<input
						type='number'
						placeholder={question.question_score}
						value={question.question_score}
						defaultValue={question.question_score || 0}
						min={'0'}
						className='input'
						onChange={(e) => {
							handleQuestionChange('question_score', parseInt(e.target.value));
						}}
					/>
				</div>
			</div>
			{/* show answers for this question */}
			{answers.length > 0 && (
				<div className='space-y-24 pt-12'>
					{answers
						.filter((answer) => {
							return answer.question_id == question.question_id;
						})
						.map((answer, index) => {
							return <Answer key={answer.id} props={{ answer: answer, index: index, setanswers: props.setanswers, answers: answers }} />;
						})}
				</div>
			)}
			{/* add new answer */}
			<button
				onClick={(e) => {
					props.addAnswer(question.question_id);
				}}
				className='btn btn-outline btn-sm m-4 max-w-[10rem] self-center'>
				Add Answer
			</button>
			<div className='divide border-[1px] border-gray-700'></div>
		</div>
		// </div>
	);
}

export default Question;
