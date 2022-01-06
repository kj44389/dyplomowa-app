import React from 'react';
import ReactPlayer from 'react-player';

const Question = ({ children, question, id, numberOfQuestions }) => {
	const { question_id, question_name, question_type, question_addon_src } = question;
	const renderTypeSwitch = () => {
		switch (question_type) {
			case 'with_audio':
				return <ReactPlayer url={`/${question_addon_src}`} height={70} width={384} controls />;
				break;
			case 'with_image':
				return <img src={`/${question_addon_src}`} className='max-w-sm' />;
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
		<div className='flex flex-col justify-center items-center md:p-5 w-full h-full'>
			<div className='w-full max-w-sm md:max-w-[900px] p-5 md:p-10'>
				<div className='px-4 py-2 text-sm rounded-md text-white  bg-green-500/20 '>
					Pytanie {id} z {numberOfQuestions} : {question_name}
				</div>
				{question_type !== 'text_one' && question_type !== 'text_many' && <div>{renderTypeSwitch()}</div>}
				<div className='flex flex-col w-full'>{children}</div>
			</div>
		</div>
	);
};

export default Question;
