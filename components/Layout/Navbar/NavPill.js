import React from 'react';

function NavPill({ text }) {
	return (
          <li className="  h-full w-25 p-3 border-r border-gray-600 flex justify-center
                         bg-gray-700 bg-opacity-40 text-gray-100 items-center text-black-400 font-medium transition-colors
                         hover:bg-primary hover:text-gray-100">
			{text}
		</li>
	);
}

export default NavPill;
