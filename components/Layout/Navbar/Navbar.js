import React, { useEffect, useState } from 'react';
import Account from './Account';
import NavPill from './NavPill';
import { useSession } from 'next-auth/react';

function Navbar() {
	const { data, status } = useSession();
	const user = data?.user;

	return (
		<nav className="navbar w-full max-w-5xl mx-auto flex justify-between items-center shadow-lg h-14 pl-4 font-normal text-sm bg-gray-600">
			{/* LogoType */}
			<div className='flex items-center  h-full w-1/2'>
				<h1 className='w-auto cursor-pointer font-serif'>
					<span className='font-extrabold text-2xl text-green-500'>Examine</span>
					<span className='font-extrabold text-2xl text-gray-100'>Lab</span>
				</h1>
				{/* nav list */}
				<ul className='h-full hidden md:flex ml-6  items-center uppercase no-underline cursor-pointer'>
					{user && (
						<>
							<NavPill text={'Stwórz test'} path={'/tests/newTest'} />
							<NavPill text={'Moje testy'} path={'/tests/show'} />
						</>
					)}
					<NavPill text={'Dołącz'} path={'/tests/solve'} />
				</ul>
			</div>
			{/* account info */}
			<Account />
		</nav>
	);
}

export default Navbar;
