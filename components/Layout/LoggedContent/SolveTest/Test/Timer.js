import { useEffect } from "react";

const Timer = ({ timeLeft, setTimeLeft, testState, questions, handleFinishTest, setTestState, setQuestions }) => {
	let timer = null;

	const calculateTimeLeft = (passedTime) => {
		const timeElements = passedTime.split(":");
		let minutes = parseInt(timeElements[0]);
		let seconds = parseInt(timeElements[1]);

		if (seconds !== 0 || minutes !== 0) {
			seconds === 0 ? ((seconds = 59), (minutes = minutes - 1)) : (seconds = seconds - 1);
		}
		return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}:00`;
	};

	//timer
	useEffect(() => {
		// if (!fetchStatus) return;

		const { index } = testState;
		let nextQuestionIndex = 0;
		// if (timeLeft === "" || timer != null) return;
		let localTimeLeft = timeLeft;

		if (timeLeft === "00:00:00") {
			questions[index].question_time = localTimeLeft;
			setQuestions((prev) => [...questions]);

			nextQuestionIndex = questions.findIndex((question) => question.question_time !== "00:00:00");
			if (nextQuestionIndex < 0) {
				handleFinishTest();
				return;
			}


			setTestState((prev) => ({ ...prev, index: nextQuestionIndex }));
			setTimeLeft(questions[nextQuestionIndex].question_time);
		}

		timer = setTimeout(() => {
			//update time left
			setTimeLeft(calculateTimeLeft(localTimeLeft));
		}, 1000);

		return () => {
			clearTimeout(timer);
			timer = null;
		};
	}, [timeLeft]);

	return (
		<div className="flex flex-1 justify-center items-center h-full w-full text-lg text-center">
			<div>
				<span className="font-mono text-4xl countdown">
					<span style={{ "--value": parseInt(timeLeft.split(":")[0]) }}></span>
				</span>
				min
			</div>
			<div>
				<span className="font-mono text-4xl countdown">
					<span style={{ "--value": parseInt(timeLeft.split(":")[1]) }}></span>
				</span>
				sec
			</div>
		</div>
	);
};

export default Timer;
