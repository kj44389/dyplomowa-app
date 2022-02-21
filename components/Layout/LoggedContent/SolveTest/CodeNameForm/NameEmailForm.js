import React from 'react';

const NameEmailForm = ({ setEmailNameForm, setTestCode, emailNameForm, formSubmit }) => {
	return (
		<div className='card bg-base-200 w-full max-w-sm p-5 md:max-w-[600px] md:p-10'>
			<h2 className='text-2xl'>Zanim zaczniesz test:</h2>
			{/* test name */}
			<div className='form-control'>
				<label className='label'>
					<span className='label-text'>Podaj swoje imię:</span>
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
					<span className='label-text'>Podaj swoje nazwisko:</span>
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
					<span className='label-text'>Podaj swoje email:</span>
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
