import React from "react";

const NameEmailForm = ({ setEmailNameForm, emailNameForm, formSubmit }) => {
	return (
		<div className="w-full max-w-sm md:max-w-[600px] p-5 md:p-10 card bg-base-200">
			<h2 className="text-2xl">Zanim zaczniesz test:</h2>
			{/* test name */}
			<div className="form-control">
				<label className="label">
					<span className="label-text">Podaj swoje imię:</span>
				</label>
				<input
					type="text"
					placeholder="Adam"
					className="input"
					onBlur={(e) => {
						setEmailNameForm({ ...emailNameForm, name: e.target.value });
					}}
				/>
			</div>
			<div className="form-control">
				<label className="label">
					<span className="label-text">Podaj swoje nazwisko:</span>
				</label>
				<input
					type="text"
					placeholder="Kowalski"
					className="input"
					onBlur={(e) => {
						setEmailNameForm({ ...emailNameForm, surname: e.target.value });
					}}
				/>
			</div>
			<div className="form-control">
				<label className="label">
					<span className="label-text">Podaj swoje email:</span>
				</label>
				<input
					type="email"
					placeholder="youremail@example.com"
					className="input"
					onBlur={(e) => {
						setEmailNameForm({ ...emailNameForm, email: e.target.value });
					}}
				/>
			</div>
			{/* test date */}
			<div className="form-control">
				<input
					type="submit"
					onClick={(e) => {
						formSubmit(e);
					}}
					className="input input-bordered text-base mt-2 max-w-xs w-full self-center hover:bg-green-500 "
				/>
			</div>
		</div>
	);
};

export default NameEmailForm;
