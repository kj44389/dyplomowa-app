import React from 'react';

const CodeForm = ({ setTestCode, crawler }) => {
	return (
		<div className='card bg-base-200 w-full max-w-sm p-5 md:max-w-[600px] md:p-10'>
			<h2 className='text-2xl'>TEST CODE</h2>
			{/* test name */}
			<div className='form-control'>
				<label className='label'>
					<span className='label-text'>Podaj kod testu:</span>
				</label>
				<input
					type='text'
					placeholder='testCode:'
					className='input'
					defaultValue={`2b6c6ac657333289`}
					onBlur={(e) => {
						setTestCode(e.target.value);
					}}
				/>
			</div>
			{/* test date */}
			<div className='form-control'>
				<input
					type='submit'
					onClick={(e) => {
						crawler;
					}}
					className='input input-bordered mt-2 w-full max-w-xs self-center text-base hover:bg-green-500 '
				/>
			</div>
		</div>
	);
};

export default CodeForm;
