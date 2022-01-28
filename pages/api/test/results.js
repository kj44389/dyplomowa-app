import { response } from "express";
import _fetch from "isomorphic-fetch";
import sql_query from "lib/db";
import moment from "moment";
import { getSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useState } from "react";
import { v4 } from "uuid";

const findQuestionIndex = (questions, id) => {
	return questions.findIndex((question) => {
		return question.question_id === id;
	});
};

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	if (req.method !== "POST") res.status(402).json({ message: "method not allowed" });

	const body = JSON.parse(req.body);
	const { questions, answers, questionsState, test_id, user_id, user_email, user_full_name } = body;
	const session = await getSession({ req });

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

				questionScore += question_score / numberCorrectAnswers;
			} else {
				questionScore = 0;
				badPick = true;
			}
		}
		pointsScored += questionScore;
	}

	// test done insert
	// test_done - { done_id, test_id, user_id, finished_at, points_scored, points_total, passed }

	try {
		const finished_at = moment().format();
		const passed = pointsScored >= pointsTotal / 2;
		let query =
			"INSERT INTO `test_done`(`done_id`, `test_id`, `user_email`,`user_full_name`, `finished_at`, `points_scored`, `points_total`, `passed`) VALUES (?,?,?,?,?,?,?,?)";
		let results = sql_query(query, [done_id, test_id, user_email, user_full_name, finished_at, pointsScored, pointsTotal, passed]);
		if (!results) throw new Exception(500, "Couldn't insert test done'");
		// answers to test_done inserting
		// test_done_answers - { id, done_id, answer_id, picked }
		//INSERT INTO `test_done_answers`(`id`, `done_id`, `answer_id`, `picked`) VALUES (?,?,?,?)
		const done_answer_id = v4();
		query = "INSERT INTO `test_done_answers`(`id`, `done_id`, `answer_id`, `picked`) VALUES ?";
		results = sql_query(query, [arrayOfAnswers]);
		if (!results) throw new Exception(500, "Couldn't associate answers with test done");

		if (session) {

			const getData = await fetch(`${absoluteUrlPrefix}/api/metadata/${user_id}`, { method: "GET" })
				.then((response) => {
					return response.text();
				})
				.then((data) => {
					return JSON.parse(data);
				});

			if (getData.status !== 200) {
				const passed = (pointsScored / pointsTotal) * 100 > 50 ? 1 : 0;
				const body = JSON.stringify({ user_id: user_id, points_scored: pointsScored, points_total: pointsTotal, tests_passed: passed, tests_total: 1 });
				const response = await _fetch(`${absoluteUrlPrefix}/api/metadata/${user_id}`, {
					method: "POST",
					body: body,
					headers: { "Content-Type": "application/json" },
				});
				if (response.status === 200) {
					return res.status(200).json({status: 200,  points_scored: pointsScored, points_total: pointsTotal, msg: `test inserted successfully` });
				}
			} else {
				const { id, user_id, points_scored, points_total, tests_passed, tests_total } = getData?.data[0];
				const passed = (pointsScored / pointsTotal) * 100 > 50 ? 1 : 0;
				const body = JSON.stringify({
					id: id,
					user_id: user_id,
					points_scored: pointsScored + points_scored,
					points_total: pointsTotal + points_total,
					tests_passed: tests_passed + passed,
					tests_total: tests_total + 1,
				});
				const response = await _fetch(`${absoluteUrlPrefix}/api/metadata/${user_id}`, {
					method: "PATCH",
					body: body,
					headers: { "Content-Type": "application/json" },
				});
				if (response.status === 200) {
					return res.status(200).json({status: 200,  points_scored: pointsScored, points_total: pointsTotal, msg: `test inserted successfully` });
				}
			}
			return res.status(200).json({ status: 200, points_scored: pointsScored, points_total: pointsTotal, msg: `test inserted successfully` });
		}

		
	} catch (err) {
		return res.status(err.status || 500 ).json({status: err.status || 500 , message: err.message });
	}

	//userMetaData
	//get user meta data

	// insert if not exists

	// update if exists
};
