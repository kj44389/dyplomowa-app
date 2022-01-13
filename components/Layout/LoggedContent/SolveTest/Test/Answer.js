import { useMemo } from "react";
import ReactPlayer from "react-player";

const Answer = ({ answer, index, question_id, disabled, onClick, picked }) => {
	const { answer_id, answer_name, answer_type, answer_addon_src } = answer;
	const renderTypeSwitch = () => {
		switch (answer_type) {
			case "with_audio":
				return useMemo(() => <ReactPlayer url={`/${answer_addon_src}`} height={70} width={384} controls />, [answer_addon_src]);
				break;
			case "with_image":
				return <img src={`/${answer_addon_src}`} className="max-w-sm" />;
				break;
			case "text_one":
				return;
				break;
			case "text_many":
				return;
				break;
		}
	};
	const input = useMemo(
		() => <input type="checkbox" className="checkbox w-6 h-6" defaultChecked={picked} disabled={disabled} onClick={(e) => onClick(question_id, answer_id)} />,
		[disabled, picked]
	);
	return (
		<div className="flex flex-row w-full items-center my-1 p-3">
			<>
				<div className="flex justify-center items-center text-md text-white-500 w-8 h-8 p-4 m-2 bg-gray-800/30 rounded-md cursor-pointer">{index + 1}</div>
				<div className="flex flex-row md:items-end md:justify-center">
					<label className="label ">
						{/* <input type="checkbox" className="checkbox w-6 h-6" defaultChecked={picked} disabled /> */}

						{input}
					</label>
				</div>
			</>
			<div className="flex flex-col max-w-sm text-sm items-center pl-5 justify-center text-center space-y-4">
				{answer_type !== "text_one" && answer_type !== "text_many" && <div>{renderTypeSwitch()}</div>}
				<div className="w-full text-center">{answer_name}</div>
			</div>
		</div>
	);
};

export default Answer;
