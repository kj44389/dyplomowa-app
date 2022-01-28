import Link from "next/link";

const ResultsCard = ({ results, testName }) => {
	const { points_scored, points_total } = results[0];
	const percentage = (points_scored / points_total) * 100;

	return (
		<div className="bg-gray-600/20 p-10 rounded-lg shadow-md">
			<h3 className="text-xs uppercase">Test Name</h3>
			<h2 className="text-sm tracking-wider">{testName}</h2>
			<h1 className="text-xl font-bold mt-3">Test Results</h1>
			<div className="mt-4 mb-8">
				<p className="text-gray-400">
					Your test score is
					<span className="font-bold text-gray-200"> {percentage.toFixed(0)}%</span>
				</p>
				<div className="bg-gray-400 w-64 h-3 rounded-lg mt-2 overflow-hidden">
					<div style={{ ["--barWidth"]: `${percentage.toFixed(0)}%` }} className="bg-green-500 w-[var(--barWidth)] h-full rounded-lg shadow-md"></div>
				</div>
				{percentage > 50 ? (
					<p className="text-xl font-bold text-white mt-3">You passed!</p>
				) : (
					<p className="text-xl font-bold text-white mt-3">Next time will be better!</p>
				)}
			</div>
			<Link href="/">
				<button className="self-center bg-orange-400 p-3 px-8 rounded text-sm font-semibold hover:bg-opacity-75">Go to Dashboard</button>
			</Link>
		</div>
	);
};

export default ResultsCard;
