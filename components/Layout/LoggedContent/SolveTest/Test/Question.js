import ReactPlayer from 'react-player';
import Image from 'next/image';

const Question = ({ children, question, id, numberOfQuestions }) => {
	const { question_id, question_name, question_type, question_addon_src } = question;
	const renderTypeSwitch = () => {
		switch (question_type) {
			case 'with_audio':
				return <ReactPlayer url={`/${question_addon_src}`} height={70} width={384} controls />;
				break;
			case 'with_image':
				return <Image alt='question image' src={`/${question_addon_src}`} className='max-w-sm' />;
				break;
			case 'text_one':
				return;
				break;
			case 'text_many':
				return;
				break;
			case 'with_youtube':
				return <ReactPlayer url={`/${question_addon_src}`} width={384} controls />;
				break;
		}
	};
	return (
		<div className='flex h-full w-full flex-col items-center justify-center md:p-5'>
			<div className='w-full max-w-sm p-5 md:max-w-[900px] md:p-10'>
				<div className='rounded-md bg-green-500/20 px-4 py-2 text-sm  text-white '>
					Pytanie {id} z {numberOfQuestions} : {question_name}
				</div>
				{question_type !== 'text_one' && question_type !== 'text_many' && <div>{renderTypeSwitch()}</div>}
				<div className='flex w-full flex-col'>{children}</div>
			</div>
		</div>
	);
};

export default Question;
