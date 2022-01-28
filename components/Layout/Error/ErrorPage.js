import React from "react";

const ErrorPage = ({ title, message }) => {
	return (
		<div className="p-5 space-y-6 text-center">
			<h1 className="text-3xl text-red-400 font-bold tracking-widest"> ERROR! </h1>
			{title && <h3 className="text-xl text-gray-200">{title}</h3>}
			<p className="text-base text-gray-300"> {message} </p>
		</div>
	);
};

export default ErrorPage;
