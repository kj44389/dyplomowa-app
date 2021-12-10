import React from 'react';
import _fetch from 'isomorphic-fetch';
import Router from 'next/router';
import { useState } from 'react';



function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState(false);
	// import { useUser } from '../../lib/useUser';
	// const { user , login } = useContext(AuthContext);

	const user = useUser();

	function validateForm() {
		return email.length > 0 && password.length > 0;
     }
	function handleSubmit(event) {

		const response = _fetch(`./api/user/getOneUser/${email}`).then(
			(response) => {
				if (response.status == 200) {
					if(user.logIn)
						Router.push('/')
					// setLoginError(false)
				}
				else {
					setLoginError(true);
				}
			}
		);

		event.preventDefault();
	}
	return (
		<div className="w-full max-w-xs">
			<form
				className="bg-white shadow-md rounded p-8 mb-4"
				method="POST"
				onSubmit={handleSubmit}
			>
			<h1 className="text-lg mb-3 font-bold">Login Form</h1>
				{/* email input */}

				<div className="mb-6 mt-6">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="email"
					>
						Your Email
						<input
							className={`shadow appearance-none border ${loginError && ("border-red-500")} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
							type="text"
							name="email"
							id="form_email"
							onChange={(e) =>
								setEmail(e.target.value)
							}
						></input>
					</label>
					{loginError && (
						<p className="text-red-500 text-xs italic">
							Please choose a correct email.
						</p>
					)}
				</div>

				{/* password input */}

				<div className="mb-6">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="password"
					>
						Your Password
						<input
							className={`shadow appearance-none border ${loginError && ("border-red-500")} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
							type="password"
							name="password"
							id="form_password"
							onChange={(e) =>
								setPassword(e.target.value)
							}
						></input>
					</label>
					{loginError && (
						<p className="text-red-500 text-xs italic">
							Please choose a correct password.
						</p>
					)}
				</div>

				{/* submit */}

				<div className='mb-6'>
					<button
						className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						id="form_submit"
						disabled={!validateForm()}
					>
						Zaloguj
					</button>
				</div>
			</form>
		</div>
	);
}

export default LoginForm;
