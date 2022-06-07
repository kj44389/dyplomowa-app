import Link from 'next/link';

const ResultsCard = ({ results, testName }) => {
	const { points_scored, points_total } = results[0];
	const percentage = (points_scored / points_total) * 100;

	return (
		<div className='rounded-lg bg-gray-600/20 p-10 shadow-md'>
			<h3 className='text-xs uppercase'>Test Name</h3>
			<h2 className='text-sm tracking-wider'>{testName}</h2>
			<h1 className='mt-3 text-xl font-bold'>Test Results</h1>
			<div className='mt-4 mb-8'>
				<p className='text-gray-400'>
					Your test score is
					<span className='font-bold text-gray-200'> {percentage.toFixed(0)}%</span>
				</p>
				<div className='mt-2 h-3 w-64 overflow-hidden rounded-lg bg-gray-400'>
					<div style={{ ['--barWidth']: `${percentage.toFixed(0)}%` }} className='h-full w-[var(--barWidth)] rounded-lg bg-green-500 shadow-md'></div>
				</div>
				{percentage > 50 ? <p className='mt-3 text-xl font-bold text-white'>You passed!</p> : <p className='mt-3 text-xl font-bold text-white'>Next time will be better!</p>}
			</div>
			<Link href='/' passHref>
				<button className='self-center rounded bg-orange-400 p-3 px-8 text-sm font-semibold hover:bg-opacity-75'>Go to Dashboard</button>
			</Link>
		</div>
	);
};

export default ResultsCard;
