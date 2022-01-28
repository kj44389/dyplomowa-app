import _fetch from 'isomorphic-fetch';
import { absoluteUrlPrefix } from 'next.config';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import Answer_addons from './Answer_addons';
import { v4 } from 'uuid';

function Answer({ props }) {
	const [answer, setAnswer] = useState(props.answer);
	const [uploadingStatus, setUploadingStatus] = useState('pending');
	const index = props.index;
	const reader = new FileReader();

	useEffect(() => {
		props.setanswers(answer);
	}, [answer]);

	useEffect(() => {
		setAnswer({ ...answer, answer_addon_src: '', answer_addon: '' });
	}, [answer.answer_type]);

	// FILE UPLOAD
	useEffect(() => {
		if (!answer.answer_addon) return;

		const form = new FormData();
		setUploadingStatus('pending');

		if (answer.answer_type === 'with_youtube') {
			handleAnswerChange('answer_addon_src', answer.answer_addon);
		} else {
			reader.readAsDataURL(answer.answer_addon);

			if (answer.answer_type === 'with_audio') {
				reader.onload = (e) => {
					handleAnswerChange('answer_addon_src', reader.result);
					form.append('audio', answer.answer_addon);
					handleAddFile(form);
				};
			}
			if (answer.answer_type === 'with_image') {
				reader.onload = (e) => {
					handleAnswerChange('answer_addon_src', reader.result);
					form.append('image', answer.answer_addon);
					handleAddFile(form);
				};
			}
		}
	}, [answer.answer_addon]);

	useEffect(() => {

		setUploadingStatus('done');

	}, [answer.answer_addon_src]);

	async function handleAddFile(form) {
		const res = await _fetch(`${absoluteUrlPrefix}/api/test/uploadFile?`, {
			method: 'POST',
			body: form,
		});
		let { data, filepath } = await res.json();
		filepath = filepath.replaceAll('\\', '/');
		handleAnswerChange('answer_addon_src', filepath);

	}

	async function handleAnswerChange(what_changing, value) {
		answer[`${what_changing}`] = value;
		setAnswer({ ...answer, [what_changing]: value });
	}

	function renderAnswerSwitch(type) {
		switch (type) {
			case 'text':
				return;
			case 'with_audio':
				return <Answer_addons props={{ type: 'audio', handleAnswerChange: handleAnswerChange, value: '' }} />;
			case 'with_image':
				return <Answer_addons props={{ type: 'image', handleAnswerChange: handleAnswerChange, value: '' }} />;
			case 'with_youtube':
				return <Answer_addons props={{ type: 'youtube', handleAnswerChange: handleAnswerChange, value: '' }} />;
		}
	}

	return (
		<div className='space-y-6'>
			<span className='flex flex-row items-center'>
				<span className='text-xs btn btn-sm rounder-full bg-gray-600 cursor-default'>ANSWER {answer.id}</span>
				<span className='h-[2px] w-full bg-gray-600/30 ml-4'></span>
			</span>

			<div className='form-control flex  flex-col md:flex-row w-full space-y-4 md:space-y-0md:space-x-2'>
				<div className='flex flex-col w-full md:w-1/2'>
					<label className='label'>
						<span className='label-text'>Type:</span>
					</label>
					<select defaultValue={'text'} className='select select-bordered w-full' onChange={(e) => handleAnswerChange('answer_type', e.target.value)}>
						<option value='text'>Sam tekst</option>
						<option value='with_audio'>Z dźwiękiem</option>
						<option value='with_image'>Z obrazkiem</option>
						<option value='with_youtube'>Z Filmikiem z YT</option>
					</select>
				</div>
				<div className='flex flex-row w-full md:items-end md:justify-center md:w-1/2'>
					<label className='label space-x-3'>
						<input type='checkbox' className='checkbox checkbox-lg' onChange={(e) => handleAnswerChange('correct', e.target.value)} />
						<span className='label-text'>Correct Answer</span>
					</label>
				</div>
			</div>
			<div className='flex justify-center items-center'>
				{answer.answer_addon_src !== '' && answer.answer_type == 'with_image' && uploadingStatus !== 'pending' && <img src={`/${answer.answer_addon_src}`} className='max-w-sm' />}
				{answer.answer_addon_src !== '' && answer.answer_type == 'with_audio' && uploadingStatus !== 'pending' && (
					<ReactPlayer url={`/${answer.answer_addon_src}`} height={70} controls />
				)}
				{answer.answer_addon_src !== '' && answer.answer_type == 'with_youtube' && uploadingStatus !== 'pending' && <ReactPlayer url={answer.answer_addon_src} controls />}
			</div>
			{renderAnswerSwitch(answer.answer_type)}
			<div className='form-control flex w-full'>
				<label className='label'>
					<span className='label-text'>Answer Name:</span>
				</label>
				<textarea className='textarea h-12' placeholder={`Answer ${index + 1}`} onBlur={(e) => handleAnswerChange('answer_name', e.target.value)}></textarea>
			</div>
		</div>
	);
}

export default Answer;
