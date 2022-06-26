import _fetch from 'isomorphic-fetch';
import { absoluteUrlPrefix } from 'next.config';
import { useEffect, useState, useCallback, useContext } from 'react';
import ReactPlayer from 'react-player';
import Answer_addons from './Answer_addons';
import { v4 } from 'uuid';
import Image from 'next/image';
import { filesContext } from 'contexts/filesContext';

function Answer({ props }) {
	const [answer, setAnswer] = useState(props.answer);
	const [uploadingStatus, setUploadingStatus] = useState('pending');
	const index = props.index;
	const fileUpload = useContext(filesContext);

	useEffect(() => {
		props.setanswers(answer);
	}, [answer]);

	const handleAnswerChange = useCallback(
		async (what_changing, value) => {
			answer[`${what_changing}`] = value;
			setAnswer({ ...answer, [what_changing]: value });
		},
		[answer]
	);

	useEffect(() => {
		// let reader = new FileReader();
		if (!answer.answer_addon || answer.answer_addon === '{}') return;

		if (answer.answer_type === 'with_youtube') {
			handleAnswerChange('answer_addon_src', answer.answer_addon);
		} else if (answer.answer_type === 'with_audio' || answer.answer_type === 'with_image') {
			// reader.readAsDataURL(answer.answer_addon);
			// reader.onload = (e) => {
			// handleAnswerChange('answer_addon_src', reader.result);

			fileUpload({
				elementSetter: handleAnswerChange,
				elementType: 'answer',
				file: answer.answer_addon,
				pathBegin: `${props.question_id}/${answer.answer_id}`,
			});
		}
	}, [answer.answer_addon]);

	function renderAnswerSwitch(type) {
		switch (type) {
			case 'text':
				return;
			case 'with_audio':
				return (
					<Answer_addons
						props={{
							type: 'audio',
							handleAnswerChange: handleAnswerChange,
							value: answer.answer_addon_src || '',
						}}
					/>
				);
			case 'with_image':
				return (
					<Answer_addons
						props={{
							type: 'image',
							handleAnswerChange: handleAnswerChange,
							value: answer.answer_addon_src || '',
						}}
					/>
				);
			case 'with_youtube':
				return (
					<Answer_addons
						props={{
							type: 'youtube',
							handleAnswerChange: handleAnswerChange,
							value: answer.answer_addon_src || '',
						}}
					/>
				);
		}
	}

	return (
		<div className='space-y-6'>
			<span className='flex flex-row items-center'>
				<span className='btn btn-sm rounder-full cursor-default bg-gray-600 text-xs'>ANSWER {answer.id}</span>
				<span className='ml-4 h-[2px] w-full bg-gray-600/30'></span>
			</span>

			<div className='form-control md:space-y-0md:space-x-2  flex w-full flex-col space-y-4 md:flex-row'>
				<div className='flex w-full flex-col md:w-1/2'>
					<label className='label'>
						<span className='label-text'>Type:</span>
					</label>
					<select defaultValue={answer.answer_type || 'text'} className='select select-bordered w-full' onChange={(e) => handleAnswerChange('answer_type', e.target.value)}>
						<option value='text'>Text</option>
						<option value='with_audio'>With audio</option>
						<option value='with_image'>With image</option>
						<option value='with_youtube'>With video (YouTube)</option>
					</select>
				</div>
				<div className='flex w-full flex-row md:w-1/2 md:items-end md:justify-center'>
					<label className='label space-x-3'>
						<input
							type='checkbox'
							className='checkbox checkbox-lg'
							defaultChecked={answer.answer_correct || false}
							onChange={(e) => handleAnswerChange('answer_correct', e.target.value)}
						/>
						<span className='label-text'>Correct Answer</span>
					</label>
				</div>
			</div>
			<div className='flex items-center justify-center'>
				{answer.answer_addon_src !== '' && answer.answer_type == 'with_image' && (
					<Image alt='Answer image' src={`${answer.answer_addon_src}`} className='max-w-sm' height={400} width={700} layout={'fixed'} />
				)}
				{answer.answer_addon_src !== '' && answer.answer_type == 'with_audio' && <ReactPlayer url={`${answer.answer_addon_src}`} height={70} controls />}
				{answer.answer_addon_src !== '' && answer.answer_type == 'with_youtube' && <ReactPlayer url={answer.answer_addon_src} controls />}
			</div>
			{renderAnswerSwitch(answer.answer_type)}
			<div className='form-control flex w-full'>
				<label className='label'>
					<span className='label-text'>Answer Name:</span>
				</label>
				<textarea
					className='textarea h-12'
					defaultValue={answer.answer_name || ''}
					placeholder={`Answer ${index + 1}`}
					onBlur={(e) => handleAnswerChange('answer_name', e.target.value)}></textarea>
			</div>
		</div>
	);
}

export default Answer;
