import React from 'react';

const NameEmailForm = ({ setEmailNameForm, setTestCode, emailNameForm, formSubmit }) => {
	return (
		<div className='card bg-base-200 m-3 mx-auto w-full max-w-sm p-5 md:max-w-[600px] md:p-10'>
			<h2 className='text-2xl'>Before your test begins, please enter:</h2>
			{/* test name */}
			<div className='form-control'>
				<label className='label'>
					<span className='label-text'>Your name:</span>
				</label>
				<input
					type='text'
					placeholder='Adam'
					className='input'
					onBlur={(e) => {
						setEmailNameForm({ ...emailNameForm, name: e.target.value });
					}}
				/>
			</div>
			<div className='form-control'>
				<label className='label'>
					<span className='label-text'>Your surname:</span>
				</label>
				<input
					type='text'
					placeholder='Kowalski'
					className='input'
					onBlur={(e) => {
						setEmailNameForm({ ...emailNameForm, surname: e.target.value });
					}}
				/>
			</div>
			<div className='form-control'>
				<label className='label'>
					<span className='label-text'>Your email:</span>
				</label>
				<input
					type='email'
					placeholder='youremail@example.com'
					className='input'
					onBlur={(e) => {
						setEmailNameForm({ ...emailNameForm, email: e.target.value });
					}}
				/>
			</div>
			<div className='form-control'>
				<label className='label'>
					<span className='label-text'>Test Code</span>
				</label>
				<input
					type='text'
					placeholder='jsadh217jasd'
					className='input'
					onBlur={(e) => {
						setTestCode(e.target.value);
					}}
				/>
			</div>
			{/* test date */}
			<div className='form-control'>
				<input
					type='submit'
					value='Enter'
					onClick={(e) => {
						formSubmit(e);
					}}
					className='input input-bordered mt-2 w-full max-w-xs self-center text-base hover:bg-green-500 '
				/>
			</div>
		</div>
	);
};

export default NameEmailForm;
