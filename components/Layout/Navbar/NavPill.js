import Link from "next/link";

function NavPill({ icon, text, path }) {
	return (
		<Link href={path} passHref prefetch={false}>
			<li
				className="  text-black-400 hover:bg-primary flex h-12 w-36 items-center justify-center
                         border-r border-gray-600 bg-gray-700 bg-opacity-40 p-3 font-medium text-gray-100
                         transition-colors hover:text-gray-100"
			>
				{icon}
				{text}
			</li>
		</Link>
	);
}

export default NavPill;
