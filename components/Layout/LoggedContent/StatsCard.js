import React from "react";

const StatsCard = ({ icon, title, data }) => {
	return (
		<div className="shadow-lg rounded-2xl p-4 m-2 w-full max-w-xs bg-white dark:bg-gray-800">
			<div className="flex items-center">
				<span className="rounded-xl relative p-2 bg-green-600">{icon}</span>
				<p className="text-md text-black dark:text-white ml-2">{title}</p>
			</div>
			<div className="flex flex-col justify-start">
				<p className="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">{title === "Total Accuracy" && data === "NaN%" ? 0 : data}</p>
				{/* <div className="flex items-center text-green-500 text-sm">
					<svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
						<path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
					</svg>
					<span>5.5%</span>
					<span className="text-gray-400">vs last month</span>
				</div> */}
			</div>
		</div>
	);
};

export default StatsCard;
