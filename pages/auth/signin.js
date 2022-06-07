import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';

function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { status } = useSession();

	useEffect(() => {
		if (status === 'loading') return;
	}, [status]);

	async function loginHandler() {
		const res = await signIn('credentials', {
			email: email,
			password: password,
		});
		if (res) Router.push('/');
		else return;
	}

	return (
		<div className='flex h-screen w-screen items-center justify-center'>
			<div className='flex max-w-md flex-col rounded-lg bg-white px-4 py-8 shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10'>
				<div className='mb-6 self-center text-xl font-light text-gray-600 dark:text-white sm:text-2xl'>Login To Your Account</div>
				<div className='mt-8'>
					<form action='#' autoComplete='off'>
						<div className='mb-2 flex flex-col'>
							<div className='relative flex '>
								<span className='inline-flex items-center  rounded-l-md border-t border-l border-b border-gray-300 bg-white  px-3 text-sm text-gray-500 shadow-sm'>
									<svg width='15' height='15' fill='currentColor' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'>
										<path d='M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z'></path>
									</svg>
								</span>
								<input
									type='text'
									id='sign-in-email'
									className=' w-full flex-1 appearance-none rounded-r-lg border border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600'
									placeholder='Your email'
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								/>
							</div>
						</div>
						<div className='mb-6 flex flex-col'>
							<div className='relative flex '>
								<span className='inline-flex items-center  rounded-l-md border-t border-l border-b border-gray-300 bg-white  px-3 text-sm text-gray-500 shadow-sm'>
									<svg width='15' height='15' fill='currentColor' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'>
										<path d='M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z'></path>
									</svg>
								</span>
								<input
									type='password'
									id='sign-in-password'
									className=' w-full flex-1 appearance-none rounded-r-lg border border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600'
									placeholder='Your password'
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>
							</div>
						</div>
						<div className='mb-6 -mt-4 flex items-center'>
							<div className='ml-auto flex'>
								<a href='#' className='inline-flex text-xs font-thin text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white sm:text-sm'>
									Forgot Your Password?
								</a>
							</div>
						</div>
						<div className='flex w-full'>
							<button
								type='submit'
								className='w-full rounded-lg  bg-purple-600 py-2 px-4 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2  focus:ring-offset-purple-200 '
								onClick={loginHandler}>
								Login
							</button>
						</div>
					</form>
				</div>
				<div className='mt-6 flex items-center justify-center'>
					<Link href={'/auth/registation'} passHref>
						<span className='inline-flex items-center text-center text-xs font-thin text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white'>
							<span className='ml-2'>You don&#x27;t have an account?</span>
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
