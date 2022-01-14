import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Account from "./Account";
import NavPill from "./NavPill";

import { PlusCircleIcon, DocumentIcon, PencilIcon } from "@heroicons/react/outline";

function Navbar() {
	const { data, status } = useSession();
	const user = data?.user;

	return (
		<nav className="navbar w-full flex justify-between items-center shadow-lg h-14 pl-4 font-normal text-sm bg-gray-600">
			{/* LogoType */}
			<div className="flex items-center  h-full w-1/2">
				<Link href="/">
					<h1 className="w-auto cursor-pointer font-serif sm:text-base md:text-2xl">
						<span className="font-extrabold text-green-500">Examine</span>
						<span className="font-extrabold text-gray-100">Lab</span>
					</h1>
				</Link>
				{/* nav list */}
				<ul className="h-full flex ml-6  items-center uppercase no-underline cursor-pointer">
					{user && (
						<>
							<NavPill heroIcon={<PlusCircleIcon />} path={"/tests/newTest"} />
							<NavPill heroIcon={<DocumentIcon />} path={"/tests/show"} />
						</>
					)}
					<NavPill heroIcon={<PencilIcon />} path={"/tests/solve"} />
				</ul>
			</div>
			<Account />
			{/* account info */}
		</nav>
	);
}

export default Navbar;
