const StatsCard = ({ icon, title, data }) => {
	return (
		<div className='flex flex-col w-full max-w-xs  bg-gray-800 text-gray-300 p-6 m-4 space-y-4 rounded-md shadow-md'>
			<div className='flex justify-center align-center bg-gray-500/20 text-lg text-gray-200 w-8 h-8 rounded-lg'>{icon}</div>
			<span className='text-green-500 text-2xl font-sans font-medium tracking-wider'>{title}</span>
			<span className=' text-gray-200 font-bold text-2xl'>{data}</span>
		</div>
	);
};

export default StatsCard;
