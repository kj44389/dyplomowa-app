import { BellIcon, UserIcon } from '@heroicons/react/outline';
import UserInfo from './UserInfo';
import { useSession } from 'next-auth/react';

function Index() {
	const { data, status } = useSession();
	const user = data?.user;
	const style = user ? 'text-gray-100 flex space-x-4 pl-4 pr-4 h-full bg-opacity-20bg-gray-700' : 'text-gray-100 flex space-x-4 pl-4 pr-4 h-full bg-opacity-20';
	return (
		<div className={style}>
			{user && <BellIcon className='hover:text-primary w-6 cursor-pointer transition-colors' />}
			<UserInfo />
		</div>
	);
}

export default Index;
