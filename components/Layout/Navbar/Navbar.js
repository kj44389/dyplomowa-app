import React, { useEffect, useState } from 'react';
import Account from './Account';
import NavPill from './NavPill';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { MenuIcon, PlayIcon, ClipboardListIcon, PlusSmIcon } from '@heroicons/react/solid';

function Navbar() {
	const { data, status } = useSession();
	const user = data?.user;

	const [navOpen, setNavOpen] = useState(false);

	return (
		<nav className='navbar transition-all w-full max-w-5xl mx-auto shadow-lg pl-4 font-normal text-sm bg-gray-600'>
			{/* LogoType */}
			<div className='transition-all h-full  mx-auto flex-wrap w-full justify-between '>
				<h1 className='w-auto cursor-pointer font-serif'>
					<a href={'/'}>
						<span className='font-extrabold text-2xl text-green-500'>Examine</span>
						<span className='font-extrabold text-2xl text-gray-100'>Lab</span>
					</a>
				</h1>
				{/* nav list */}
				<div className='md:order-2'>
					<button className='text-gray-300 p-4 flex md:hidden' onClick={() => setNavOpen(!navOpen)}>
						<MenuIcon className='w-8' />
					</button>
					<div className='h-full hidden md:flex ml-6  items-center uppercase no-underline cursor-pointer'>
						{user && (
							<>
								<NavPill text={'Stwórz test'} path={'/tests/newTest'} />
								<NavPill text={'Moje testy'} path={'/tests/show'} />
							</>
						)}
						<NavPill text={'Dołącz'} path={'/tests/solve/'} />
					</div>
				</div>
				<div
					className={
						'rounded-lg md:hidden bg-gray-600 fixed z-10 top-24 right-0 transition-all justify-end items-center w-full max-w-xs md:w-auto md:order-1' +
						(navOpen ? '  animate-slideIn ' : ' animate-slideOut ')
					}>
					<ul className='flex flex-col transition-all space-y-3 p-6 text-lg font-normal tracking-wider md:flex-row md:space-x-8 md:mt-0 md:font-medium'>
						<a className='min-w-xs transition-colors w-full text-gray-100  hover:bg-gray-800/20 rounded-md' href={'/tests/newTest'}>
							<li className='flex justify-end items-center p-4 space-x-2'>
								<span>Nowy Test</span>
								<PlusSmIcon className='w-6' />
							</li>
						</a>
						<a className='min-w-xs transition-colors w-full text-gray-100 hover:bg-gray-800/20 rounded-md' href={'/tests/show'}>
							<li className='flex justify-end items-center p-4 space-x-2'>
								<span>Moje Testy</span>
								<ClipboardListIcon className='w-5' />
							</li>
						</a>
						<a className='min-w-xs transition-colors w-full text-gray-100 hover:bg-gray-800/20 rounded-md' href={'/tests/solve/'}>
							<li className='flex justify-end items-center p-4 space-x-2'>
								<span>Dołącz do Testu</span>
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
