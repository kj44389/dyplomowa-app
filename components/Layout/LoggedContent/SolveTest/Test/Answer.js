import ReactPlayer from 'react-player';
import Image from 'next/image';

const Answer = ({ answer, index, question_id, disabled, picked, onClick }) => {
	const { answer_id, answer_name, answer_type, answer_addon_src } = answer;
	const renderTypeSwitch = () => {
		switch (answer_type) {
			case 'with_audio':
				return <ReactPlayer url={`${answer_addon_src}`} height={70} width={340} controls />;
				break;
			case 'with_image':
				return <Image alt='answer image' src={`${answer_addon_src}`} className='max-w-sm' layout={'fill'} objectFit={'cover'} />;
				break;
			case 'text_one':
				return;
				break;
			case 'text_many':
				return;
				break;
		}
	};
	return (
		<div className='my-1 flex h-full w-full flex-row items-center p-3'>
			<>
				<div className='text-md text-white-500 m-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-gray-800/30 p-4'>{index + 1}</div>
				<div className='flex flex-row md:items-end md:justify-center'>
					<label className='label '>
						<input type='checkbox' className='checkbox h-6 w-6' defaultChecked={picked} disabled={disabled} onClick={(e) => onClick(question_id, answer_id)} />
					</label>
				</div>
			</>
			<div className='flex-column flex h-full max-h-64 w-full max-w-sm flex-col items-center justify-center space-y-4 pl-5 text-center text-sm'>
				{answer_type !== 'text_one' && answer_type !== 'text_many' && <div className='relative h-64 max-h-64 w-full max-w-sm'>{renderTypeSwitch()}</div>}
				<div className='w-full text-center'>{answer_name}</div>
			</div>
		</div>
	);
};

export default Answer;
