import React, { useEffect, useState } from 'react';
import Account from './Account';
import NavPill from './NavPill';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import { MenuIcon, PlayIcon, ClipboardListIcon, PlusSmIcon } from '@heroicons/react/solid';

function Navbar() {
	const { data, status } = useSession();
	const user = data?.user;

	const [navOpen, setNavOpen] = useState(false);

	return (
		<nav className='navbar mx-auto w-full max-w-5xl bg-gray-600 pl-4 text-sm font-normal shadow-lg transition-all'>
			{/* LogoType */}
			<div className='mx-auto h-full  w-full flex-wrap justify-between transition-all '>
				<h1 className='w-auto cursor-pointer font-serif'>
					<a href={'/'}>
						<span className='text-2xl font-extrabold text-green-500'>Examine</span>
						<span className='text-2xl font-extrabold text-gray-100'>Lab</span>
					</a>
				</h1>
				{/* nav list */}
				<div className='md:order-2'>
					<button className='flex p-4 text-gray-300 md:hidden' onClick={() => setNavOpen(!navOpen)}>
						<MenuIcon className='w-8' />
					</button>
					<div className='ml-6 hidden h-full cursor-pointer  items-center uppercase no-underline md:flex'>
						{user && (
							<>
								<NavPill icon={<PlusSmIcon className='w-6' />} text={'New Test'} path={'/test/newTest'} />
								<NavPill icon={<ClipboardListIcon className='w-5' />} text={'My Tests'} path={'/tests/show'} />
							</>
						)}
						<NavPill icon={<PlayIcon className='w-5' />} text={'Join'} path={'/test/solve/'} />
						{user ? (
							<button className='btn btn-sm btn-outline m-2' onClick={(e) => signOut()}>
								Log Out
							</button>
						) : (
							<Link href={'/auth/signin?#'} passHref>
								<button className='btn btn-sm btn-outline m-2'>Log In</button>
							</Link>
						)}
					</div>
				</div>
				<div
					className={
						'fixed top-24 right-0 z-10 w-full max-w-xs items-center justify-end rounded-lg bg-gray-600 transition-all md:order-1 md:hidden md:w-auto' +
						(navOpen ? '  animate-slideIn ' : ' animate-slideOut ')
					}>
					<ul className='flex flex-col space-y-3 p-6 text-lg font-normal tracking-wider transition-all md:mt-0 md:flex-row md:space-x-8 md:font-medium'>
						<a className='min-w-xs w-full rounded-md border border-gray-800/20 text-gray-100  transition-colors hover:bg-gray-800/20' href={'/test/newTest'}>
							<li className='flex items-center justify-end space-x-2 p-4'>
								<span>New Test</span>
								<PlusSmIcon className='w-6' />
							</li>
						</a>
						<a className='min-w-xs w-full rounded-md border border-gray-800/20 text-gray-100 transition-colors hover:bg-gray-800/20' href={'/tests/show'}>
							<li className='flex items-center justify-end space-x-2 p-4'>
								<span>My Tests</span>
								<ClipboardListIcon className='w-5' />
							</li>
						</a>
						<a className='min-w-xs w-full rounded-md border border-gray-800/20 text-gray-100 transition-colors hover:bg-gray-800/20' href={'/test/solve/'}>
							<li className='flex items-center justify-end space-x-2 p-4'>
								<span>Join to test</span>
								<PlayIcon className='w-5' />
							</li>
						</a>
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
