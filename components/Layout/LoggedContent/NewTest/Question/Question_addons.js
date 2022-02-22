import React, { useEffect, useState, useRef } from 'react';

function Question_addons({ props }) {
	const [youtubePicked, setyoutubePicked] = useState(false);
	const youtubeUrl = useRef();

	useEffect(() => {
		if (!youtubePicked) return;
		props.handleQuestionChange('question_addon', youtubeUrl.current.value);
		setyoutubePicked(false);
	}, [youtubePicked]);

	let LabelClassName = `label flex flex-col space-y-4 items-start md:flex md:flex-row md:space-y-0 md:items-center`;
	if (props.type === 'youtube') {
		LabelClassName = `label flex flex-col space-y-4 items-start `;
	}

	return (
		<div className='form-control'>
			<label className={LabelClassName}>
				<span className='label-text'>Add question {props.type}: </span>
				{props.type === 'youtube' && (
					<>
						<input
							type='url'
							placeholder='https://www.youtube.com/watch?v=E8gmARGvPlI'
							defaultValue={props.value}
							ref={youtubeUrl}
							className='w-full rounded-lg px-2 py-2 text-base text-gray-400'></input>
						<button
							className='btn btn-sm self-center outline outline-2 outline-green-500'
							onClick={(e) => {
								setyoutubePicked(true);
							}}>
							Załaduj film
						</button>
					</>
				)}
				{(props.type === 'audio' || props.type === 'image') && (
					<input
						type='file'
						className='file:border-primarygreen text-gray-400 file:mr-4 file:rounded-xl file:border-2 file:border-solid file:bg-transparent file:py-2 file:px-4 file:text-sm file:font-semibold file:text-gray-300 hover:file:bg-gray-800/30'
						onChange={(e) => {
							props.handleQuestionChange('question_addon', e.target.files[0]);
						}}></input>
				)}
			</label>
		</div>
	);
}

export default Question_addons;
