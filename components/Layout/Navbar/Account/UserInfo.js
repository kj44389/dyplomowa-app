import AccessButton from "../AccessButton";
import { useSession } from "next-auth/react";
// import login from 'pages/auth/login';
import { signIn, signOut } from "next-auth/react";
import Router from "next/router";

import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";

function UserInfo() {
	const { data, status } = useSession();
	const user = data?.user;

	async function signOutHandler() {
		await signOut();
	}
	async function signInHandler() {
		Router.replace("/auth/signin?#");
	}

	return (
		<div className="flex justify-center items-center space-x-4 cursor-pointer w-full h-full pr-2 ">
			{/* <UserIcon className='w-6' alt='Notifications' /> */}
			{/* <ChevronDownIcon className='w-6' /> */}
			{/* <div className="flex items-stretch"> */}
			{user ? (
				<span
					className="h-full  p-3 border-r border-gray-600 flex justify-center
                         bg-gray-700 bg-opacity-40 text-gray-100 items-center text-black-400 font-medium transition-colors
                         hover:bg-primary hover:text-gray-100 space-x-2"
				>
					{/* <div className="flex flex-none space-x-2">
                        <div className="avatar">
                            <div className="rounded-full w-10 h-10 m-1">
                                <img src="https://i.pravatar.cc/500?img=32" />
                            </div>
                        </div>
                        <span className="flex items-center text-base hover:text-primary transition-colors">
                            {user.name}
                        </span>
                    </div> */}
					<span className="hidden md:flex" onClick={signOutHandler}>
						Wyloguj
						<AccessButton heroIcon={<LogoutIcon />} style={"w-5"} />
					</span>
				</span>
			) : (
				<>
					<span
						className="h-full p-3 border-r border-gray-600 flex justify-center
                         bg-gray-700 bg-opacity-40 text-gray-100 items-center text-black-400 font-medium transition-colors
                         hover:bg-primary hover:text-gray-100 space-x-3"
					>
						<span className="hidden md:flex" onClick={signInHandler}>
							Zaloguj
							<AccessButton heroIcon={<LoginIcon />} style={"w-5"} />
						</span>
					</span>
					{/* <span
						className="h-full w-12 p-3 border-r border-gray-600 flex justify-center
                     bg-gray-700 bg-opacity-40 text-gray-100 items-center text-black-400 font-medium transition-colors
                     hover:bg-primary hover:text-gray-100"
					>
						<AccessButton heroIcon={<LoginIcon />} onClick={signInHandler} style={"w-8"} />
					</span> */}
				</>
			)}
		</div>
		// </div>
	);
}

export default UserInfo;
