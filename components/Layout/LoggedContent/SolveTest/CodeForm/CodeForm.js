import React from 'react';

const CodeForm = ({ setTestCode }) => {
	return (
		<div className='w-full max-w-sm md:max-w-[600px] p-5 md:p-10 card bg-base-200'>
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
					value={`2b6c6ac657333289`}
					onBlur={(e) => {
						setTestCode(e.target.value);
					}}
				/>
			</div>
			{/* test date */}
			<div className='form-control'>
				<input type='submit' className='input input-bordered text-base mt-2 max-w-xs w-full self-center hover:bg-green-500 ' />
			</div>
		</div>
	);
};

export default CodeForm;
