import _fetch from 'isomorphic-fetch';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { v4 } from 'uuid';
import { supabase } from 'lib/supabase';

const findQuestionIndex = (questions, id) => {
	return questions.findIndex((question) => {
		return question.question_id === id;
	});
};

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

const handler = async (req, res) => {
	res.setHeader('Cache-Control', 'max-age=10');
	if (req.method !== 'POST') res.status(402).json({ message: 'method not allowed' });

	const body = JSON.parse(req.body);
	const { questions, answers, questionsState, test_id, user_email, user_full_name } = body;
	const session = await getSession({ req });

	let pointsScored = 0;
	let pointsTotal = 0;
	let arrayOfAnswers = [];
	const done_id = v4();

	const correctAnswers = answers.filter((answer) => {
		return answer?.answer.answer_correct === true;
	});

	for (const question of questions) {
		const { question_id, question_score } = question;
		pointsTotal += question_score;
		const numberCorrectAnswers = answers.filter((answer) => {
			return answer?.answer.answer_correct === true && answer.question_id === question_id;
		}).length;

		let badPick = false;
		let questionScore = 0;

		for (const state of questionsState.filter((e) => e.question_id === question_id)) {
			const { answer_id, picked } = state;

			arrayOfAnswers.push([v4(), done_id, answer_id, picked]);
			if (!picked || badPick) continue;
			if (correctAnswers.filter((answer) => answer?.answer.answer_id === answer_id).length > 0) {
				questionScore += question_score / numberCorrectAnswers;
			} else {
				questionScore = 0;
				badPick = true;
			}
		}
		pointsScored += questionScore;
	}

	try {
		const finished_at = moment().format();
		const passed = pointsScored >= pointsTotal / 2;

		let { data, error } = await supabase.from('test_done').insert([
			{
				done_id: done_id,
				test_id: test_id,
				user_email: user_email,
				user_full_name: user_full_name,
				finished_at: finished_at,
				points_scored: pointsScored,
				points_total: pointsTotal,
				passed: passed ? 1 : 0,
			},
		]);

		if (error) throw new Exception(500, "Couldn't insert test done'");
		const done_answer_id = v4();
		let arrayOfJsons = [];
		for (let answer of arrayOfAnswers) {
			arrayOfJsons.push({
				id: answer[0],
				done_id: answer[1],
				answer_id: answer[2],
				picked: answer[3],
			});
		}
		let { data: doneAnswers, error: doneAnswersError } = await supabase.from('test_done_answers').insert(arrayOfJsons);
		if (doneAnswersError) {
			throw new Exception(500, "Couldn't associate answers with test done");
		}

		if (session) {
			const getData = await fetch(`${absoluteUrlPrefix}/api/v2/metadata/${user_email}`, { method: 'GET' })
				.then((response) => {
					return response.text();
				})
				.then((data) => {
					return JSON.parse(data);
				});

			if (getData.status !== 200 || getData.data.length === 0) {
				const passed = (pointsScored / pointsTotal) * 100 > 50 ? 1 : 0;
				const body = JSON.stringify({
					user_email: user_email,
					points_scored: pointsScored,
					points_total: pointsTotal,
					tests_passed: passed,
					tests_total: 1,
				});
				const response = await _fetch(`${absoluteUrlPrefix}/api/v2/metadata/${user_email}`, {
					method: 'POST',
					body: body,
					headers: { 'Content-Type': 'application/json' },
				});
				if (response.status === 200) {
					return res.status(200).json({
						status: 200,
						points_scored: pointsScored,
						points_total: pointsTotal,
						msg: `test inserted successfully`,
					});
				}
			} else {
				const { id, user_email, points_scored, points_total, tests_passed, tests_total } = getData?.data;
				const passed = (pointsScored / pointsTotal) * 100 > 50 ? 1 : 0;
				const body = JSON.stringify({
					id: id,
					user_email: user_email,
					points_scored: pointsScored + points_scored,
					points_total: pointsTotal + points_total,
					tests_passed: tests_passed + passed,
					tests_total: tests_total + 1,
				});
				const response = await _fetch(`${absoluteUrlPrefix}/api/v2/metadata/${user_email}`, {
					method: 'PATCH',
					body: body,
					headers: { 'Content-Type': 'application/json' },
				});
				if (response.status === 200) {
					return res.status(200).json({
						status: 200,
						points_scored: pointsScored,
						points_total: pointsTotal,
						msg: `test inserted successfully`,
					});
				}
			}
			return res.status(200).json({
				status: 200,
				points_scored: pointsScored,
				points_total: pointsTotal,
				msg: `test inserted successfully`,
			});
		}
		return res.status(200).json({
			status: 200,
			points_scored: pointsScored,
			points_total: pointsTotal,
			msg: `test inserted successfully`,
		});
	} catch (err) {
		return res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
	}
};

export default handler;
