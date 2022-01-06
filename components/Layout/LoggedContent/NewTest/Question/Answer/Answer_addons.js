import React, { useEffect, useRef, useState } from 'react';

function Answer_addons({ props }) {
	const [youtubePicked, setyoutubePicked] = useState(false);
	const youtubeUrl = useRef();

	useEffect(() => {
		if (!youtubePicked) return;
		props.handleAnswerChange('answer_addon', youtubeUrl.current.value);
		setyoutubePicked(false);
	}, [youtubePicked]);

	let LabelClassName = `label flex flex-col space-y-4 items-start md:flex md:flex-row md:space-y-0 md:items-center`;
	if (props.type === 'youtube') {
		LabelClassName = `label flex flex-col space-y-4 items-start `;
	}
	return (
		<div className='form-control'>
			<label className={LabelClassName}>
				<span className='label-text'>Add answer {props.type}: </span>
				{props.type === 'youtube' && (
					<>
						<input
							type='url'
							placeholder='https://www.youtube.com/watch?v=E8gmARGvPlI'
							ref={youtubeUrl}
							className='text-gray-400 px-2 py-2 w-full text-base rounded-lg'></input>
						<button
							className='btn btn-sm self-center outline outline-green-500 outline-2'
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
						className='text-gray-400 file:rounded-xl file:border-2 file:border-primarygreen file:border-solid file:bg-transparent file:text-gray-300 hover:file:bg-gray-800/30 file:py-2 file:px-4 file:mr-4 file:text-sm file:font-semibold'
						onChange={(e) => {
							props.handleAnswerChange('answer_addon', e.target.files[0]);
						}}></input>
				)}
			</label>
		</div>
	);
}

export default Answer_addons;
