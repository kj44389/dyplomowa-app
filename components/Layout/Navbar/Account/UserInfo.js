import AccessButton from '../AccessButton';
import { useSession } from 'next-auth/react';
// import login from 'pages/auth/login';
import { signIn, signOut } from 'next-auth/react';
import Router from 'next/router';
import Image from 'next/image';

function UserInfo() {
	const { data, status } = useSession();
	const user = data?.user;

	async function signOutHandler() {
		await signOut();
	}
	async function signInHandler() {
		Router.push('/auth/signin?#');
	}

	return (
		<div className='flex h-full w-full cursor-pointer items-center justify-center space-x-4 pr-2 '>
			{/* <UserIcon className='w-6' alt='Notifications' /> */}
			{/* <ChevronDownIcon className='w-6' /> */}
			{/* <div className="flex items-stretch"> */}
			{user ? (
				<>
					<div className='flex flex-none space-x-2'>
						<div className='avatar'>
							<div className='m-1 h-10 w-10 rounded-full'>
								<Image alt='profile pictrure' src='https://i.pravatar.cc/500?img=32' />
							</div>
						</div>
						<span className='hover:text-primary flex items-center text-base transition-colors'>{user.name}</span>
					</div>
					<AccessButton text={'Wyloguj'} onClick={signOutHandler} style={'btn btn-outline btn-sm rounded-btn'} />
				</>
			) : (
				<>
					<AccessButton text={'Zaloguj'} onClick={signInHandler} style={'btn btn-sm rounded-btn'} />
					<AccessButton text={'Zarejestruj'} onClick={signInHandler} style={'btn btn-ghost btn-sm rounded-btn'} />
				</>
			)}
		</div>
		// </div>
	);
}

export default UserInfo;
