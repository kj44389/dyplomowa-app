import { useState, useEffect } from "react";

const useTimer = () => {
	let timer = null;
	const init = (time) => {
		setTimeLeft(time);
	};

	const stop = () => {
		clearTimeout(timer);
		return timeLeft;
	};

	// useEffect(() => {
	//   console.log(timeLeft);
	//   const timer = setTimeout(() => {
	//     setTimeLeft(calculateTimeLeft(timeLeft));
	//   }, 1000);
	//   return () => clearTimeout(timer);
	// }, [timeLeft]);
	// useEffect(() => {
	//   const time = calculateTimeLeft(timeLeft);
	//   time !== null ? setTimeLeft(time) : null;
	//   // setTimeLeft(time);
	// }, [timeLeft]);
	return { init, stop };
};

export default useTimer;
