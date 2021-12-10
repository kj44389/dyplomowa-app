import React from 'react';
import Account from './Account';
import NavPill from './NavPill';
import { useUser } from './../../../lib/useUser';

function Navbar() {
	return (
		<nav className="flex justify-between items-center w-screen h-15 pl-4 font-normal text-base bg-gray-600">
			{/* LogoType */}
			<div className="flex items-center  h-full w-1/2">
				<h1 className="w-auto cursor-pointer">
					<span className="font-extrabold text-2xl text-primary">
						Examine
					</span>
					<span className="font-extrabold text-2xl text-gray-100">
						Lab
					</span>
				</h1>
				{/* nav list */}
				<ul className="h-full hidden md:flex ml-6  items-center uppercase no-underline cursor-pointer">
					<NavPill text={'Stwórz test'} />
					<NavPill text={'Moje testy'} />

					<NavPill text={'Dołącz'} />
				</ul>
			</div>
			{/* account info */}
			<Account />
		</nav>
	);
}

export default Navbar;
