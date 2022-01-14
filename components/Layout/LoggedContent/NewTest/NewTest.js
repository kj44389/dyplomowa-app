import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import Question from "./Question/Question";
import crypto from "crypto";
import { useSession } from "next-auth/react";
import { type } from "os";

function NewTest() {
	const { data, status } = useSession();
	const test_id = v4();
	const code = crypto.randomBytes(8).toString("hex");
	const [test, setTest] = useState({
		id: test_id,
		date: "",
		name: "",
		code: code,
		test_creator: data?.id,
		type: "PUBLIC",
	});
	const [questions, setquestions] = useState([]);
	const [answers, setanswers] = useState([]);

	useEffect(() => {
		console.log([...Object.values(test)]);
	}, [test]);
	async function handleQuestionsUpdate(question) {
		questions[question.id - 1] = question;
		setquestions((prevVal) => [...prevVal]);
		console.log(questions);
	}
	async function handleAnswersUpdate(answer) {
		answers[answer.id - 1] = answer;
		setanswers((prevVal) => [...prevVal]);
	}
	function handleAddQuestion() {
		setquestions([
			...questions,
			{
				id: questions.length + 1,
				question_id: v4(),
				question_name: "",
				question_time: "",
				question_type: "text_one",
				question_score: 0,
				question_addon: "",
				question_addon_src: "",
			},
		]);
	}
	function handleAddAnswer(question_id) {
		setanswers([
			...answers,
			{
				id: answers.length + 1,
				answer_id: v4(),
				question_id: question_id,
				answer_name: "",
				answer_type: "text_one",
				answer_addon: "",
				answer_addon_src: "",
				correct: "",
			},
		]);
	}

	function handleSubmit() {
		console.log("test", test);
		console.log("questions", questions);
		console.log("answers", answers);
		const body = JSON.stringify({
			questions: questions,
			answers: answers,
			test: test,
		});
		const res = fetch(`${absoluteUrlPrefix}/api/test/${test.id}`, { method: "POST", body: body });
	}

	return (
		<div className="flex flex-col flex-1 justify-center items-center md:p-5">
			<div className="w-full max-w-sm md:max-w-[600px] p-5 md:p-10 card bg-base-200">
				<h2 className="text-2xl">Nowy test</h2>
				{/* test name */}
				<div className="form-control">
					<label className="label">
						<span className="label-text">Nazwa testu</span>
					</label>
					<input type="text" placeholder="Podsumowanie działu:" className="input" onChange={(e) => setTest({ ...test, name: e.target.value })} />
				</div>
				{/* test date */}
				<div className="form-control">
					<label className="label">
						<span className="label-text">Data zakończenia testu</span>
					</label>
					<input type="datetime-local" className="input" onChange={(e) => setTest({ ...test, date: e.target.value })} />
				</div>
				{/* test type */}
				<div className="form-control">
					<label className="label">
						<span className="label-text">Typ testu</span>
					</label>
					<select defaultValue="PUBLIC" className="select select-bordered w-full max-w-xs" onChange={(e) => setTest({ ...test, type: e.target.value })}>
						<option value="PUBLIC">Publiczny</option>
						<option value="PRIVATE">Prywatny</option>
					</select>
				</div>
			</div>

			{questions.length > 0 && (
				<div className="w-full max-w-sm md:max-w-[600px] mt-3 mb-3 p-1 md:p-10 card bg-base-200">
					{questions.map((question) => {
						return (
							<Question
								props={{
									questions: questions,
									question: question,
									setquestions: handleQuestionsUpdate,
									answers: answers,
									addAnswer: handleAddAnswer,
									setanswers: handleAnswersUpdate,
								}}
								key={question.id}
							/>
						);
					})}
				</div>
			)}

			<button onClick={handleAddQuestion} className="m-4 btn btn-outline btn-sm">
				Dodaj Pytanie
			</button>
			<button onClick={handleSubmit} className="fixed bottom-1 right-1 m-4 btn btn bg-green-500">
				Wyślij
			</button>
		</div>
	);
}

export default NewTest;
