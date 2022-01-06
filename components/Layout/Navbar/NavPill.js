import Link from 'next/link'

function NavPill({ text, path }) {
    return (
        <Link href={path}>
            <li
                className="  h-full w-32 p-3 border-r border-gray-600 flex justify-center
                         bg-gray-700 bg-opacity-40 text-gray-100 items-center text-black-400 font-medium transition-colors
                         hover:bg-primary hover:text-gray-100"
            >
                {text}
            </li>
        </Link>
    )
}

export default NavPill
