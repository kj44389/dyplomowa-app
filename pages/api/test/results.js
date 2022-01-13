import sql_query from "lib/db";
import moment from "moment";
import { v4 } from "uuid";

const findQuestionIndex = (questions, id) => {
	return questions.findIndex((question) => {
		return question.question_id === id;
	});
};

export default async (req, res) => {
	if (req.method !== "POST") res.status(400).json({ message: "method not allowed" });

	const body = JSON.parse(req.body);
	const { questions, answers, questionsState, test_id, user_id } = body;

	let pointsScored = 0;
	let pointsTotal = 0;
	let arrayOfAnswers = [];
	const done_id = v4();

	const correctAnswers = answers.filter((answer) => {
		return answer.answer_correct === 1;
	});

	// test_done - { done_id, test_id, user_id, finished_at, points_scored, points_total, passed }
	// test_done_answers - { id, done_id, answer_id, picked }

	for (const question of questions) {
		const { question_id, question_score } = question;
		pointsTotal += question_score;
		const numberCorrectAnswers = answers.filter((answer) => {
			return answer.answer_correct === 1 && answer.question_id === question_id;
		}).length;

		let badPick = false;
		let questionScore = 0;

		for (const state of questionsState.filter((e) => e.question_id === question_id)) {
			const { answer_id, picked } = state;
			arrayOfAnswers.push([v4(), done_id, answer_id, picked]);
			if (!picked || badPick) continue;
			if (correctAnswers.filter((answer) => answer.answer_id === answer_id).length > 0) {
				console.log("--------------------------", question_score, numberCorrectAnswers);
				questionScore += question_score / numberCorrectAnswers;
			} else {
				questionScore = 0;
				badPick = true;
			}
		}
		pointsScored += questionScore;
	}

	console.log(`points total: ${pointsTotal} points scored: ${pointsScored}`);
	// test done insert
	// test_done - { done_id, test_id, user_id, finished_at, points_scored, points_total, passed }
	// INSERT INTO `test_done`(`done_id`, `test_id`, `user_id`, `finished_at`, `points_scored`, `points_total`, `passed`) VALUES (?,?,?,?,?,?,?)

	try {
		const finished_at = moment().format();
		const passed = pointsScored >= pointsTotal / 2;
		let query = "INSERT INTO `test_done`(`done_id`, `test_id`, `user_id`, `finished_at`, `points_scored`, `points_total`, `passed`) VALUES (?,?,?,?,?,?,?)";
		let results = sql_query(query, [done_id, test_id, user_id, finished_at, pointsScored, pointsTotal, passed]);
		if (!results) throw new Error("Couldn't insert test done'");
		// answers to test_done inserting
		// test_done_answers - { id, done_id, answer_id, picked }
		//INSERT INTO `test_done_answers`(`id`, `done_id`, `answer_id`, `picked`) VALUES (?,?,?,?)
		const done_answer_id = v4();
		console.log(arrayOfAnswers);
		query = "INSERT INTO `test_done_answers`(`id`, `done_id`, `answer_id`, `picked`) VALUES ?";
		results = sql_query(query, [arrayOfAnswers]);
		if (!results) throw new Error("Couldn't associate answers with test done");

		res.status(200).json({ msg: `test inserted successfully` });
	} catch (error) {
		res.status(500).send(error.message);
	}

	//userMetaData
	// insert if not exists

	// update if exists
};
