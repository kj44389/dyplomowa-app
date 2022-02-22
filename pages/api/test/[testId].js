import { set } from 'express/lib/application';
import sql_query from 'lib/db';
import { getSession } from 'next-auth/react';

function notFoundException(status, message) {
	this.status = status;
	this.message = message;
}

export default async (req, res) => {
	const session = await getSession({ req });
	const test_id = req.query.testId;
	try {
		if (req.method === 'GET') {
			const query = 'SELECT * FROM tests WHERE test_id =?';
			const results = await sql_query(query, [test_id]);
			if (results.length == 0) {
				throw new notFoundException(404, 'Tests not found!');
			}
			return res.json(results);
		} else if (req.method === 'POST') {
			if (!session) throw new notFoundException(405, 'not authorized to create new test');
			const body = JSON.parse(req.body);
			const questions = body.questions;
			const answers = body.answers;
			const test = body.test;
			let emails = test.emails.split(',');
			for (let i = 0; i < emails.length; i++) {
				emails[i] = emails[i].trim();
			}
			let query = 'INSERT INTO `tests`(`test_id`, `test_date`, `test_name`, `test_code`, `test_creator`, `test_type`) VALUES (?,?,?,?,?,?)';
			let results = sql_query(query, [test.test_id, test.test_date, test.test_name, test.test_code, session.id, test.test_type]);

			questions.map((question) => {
				//inserting questions
				query =
					'INSERT INTO `questions`(`question_id`,`question_name`, `question_score`, `question_time`, `question_type`, `question_addon`, `question_addon_src`) VALUES (?,?,?,?,?,NULL,?)';
				results = sql_query(query, [
					question.question_id,
					question.question_name,
					question.question_score,
					question.question_time,
					question.question_type,
					question.question_addon_src,
				]);

				//creating relation test-question
				query = 'INSERT INTO `tests_questions`(`test_id`, `question_id`) VALUES (?,?)';
				results = sql_query(query, [test.test_id, question.question_id]);

				// inserting answers
				answers
					.filter((answer) => {
						return answer.question_id == question.question_id;
					})
					.map((answer) => {
						let correct = 0;
						if (answer.correct === 'on') correct = 1;
						else if (answer.correct !== 'on') correct = 0;
						query = 'INSERT INTO `answers`(`answer_id`,`answer_name`, `answer_type`, `answer_correct`, `answer_addon`, `answer_addon_src`) VALUES (?,?,?,?,NULL,?)';
						results = sql_query(query, [answer.answer_id, answer.answer_name, answer.answer_type, correct, answer.answer_addon_src]);

						//creating relation
						query = 'INSERT INTO `questions_answers`(`question_id`, `answer_id`) VALUES (?,?)';
						results = sql_query(query, [question.question_id, answer.answer_id]);
					});
			});

			//creating relation test-users
			emails.map((email) => {
				query = 'INSERT INTO test_participants(id,user_email,test_id) VALUES (NULL,?,?)';
				results = sql_query(query, [email, test.test_id]);
			});
			if (!emails.includes(session.email)) {
				query = 'INSERT INTO test_participants(id,user_email,test_id) VALUES (NULL,?,?)';
				results = sql_query(query, [session.email, test.test_id]);
			}
			return res.json({ status: 200, statusText: 'Test created successfully' });
		} else if (req.method === 'PATCH') {
			const body = JSON.parse(req.body);
			const questions = body.questions;
			const answers = body.answers;
			const test = body.test;
			let emails = test.emails.split(',');
			if (!session && session.id === test.test_creator) throw new notFoundException(405, 'not authorized to update test');
			for (let i = 0; i < emails.length; i++) {
				emails[i] = emails[i].trim();
			}

			let query = 'UPDATE tests SET test_id = ?, test_date = ?, test_name = ?, test_code = ?, test_creator = ?, test_type = ? WHERE test_id = ?';
			let results = sql_query(query, [test.test_id, test.test_date, test.test_name, test.test_code, test.test_creator, test.test_type, test.test_id]);

			questions.map((question) => {
				//inserting questions

				query = 'SELECT * FROM questions where question_id=?';
				results = sql_query(query, [question.question_id]).then((res) => {
					if (res.length === 0) {
						query =
							'INSERT INTO `questions`(question_id, question_name, question_score, question_time, question_type, question_addon, question_addon_src) VALUES (?,?,?,?,?,NULL,?)';
						sql_query(query, [
							question.question_id,
							question.question_name,
							question.question_score,
							question.question_time,
							question.question_type,
							question.question_addon_src,
						]);
					} else {
						query =
							'UPDATE questions SET question_id = ?, question_name = ?, question_score = ?, question_time = ?, question_type = ?, question_addon = NULL, question_addon_src = ? WHERE question_id = ?';
						sql_query(query, [
							question.question_id,
							question.question_name,
							question.question_score,
							question.question_time,
							question.question_type,
							question.question_addon_src,
							question.question_id,
						]);
					}
				});

				query = 'SELECT * FROM tests_questions WHERE test_id = ? AND question_id = ?';
				results = sql_query(query, [test.test_id, question.question_id]).then((res) => {
					if (res.length === 0) {
						//creating relation test-question
						query = 'INSERT INTO tests_questions(test_id, question_id) VALUES (?,?)';
						sql_query(query, [test.test_id, question.question_id]);
					}
				});

				// // inserting answers
				answers
					.filter((answer) => {
						return answer.question_id == question.question_id;
					})
					.map((answer) => {
						console.log(answer);
						let correct = 0;
						if (answer.correct === 'on') correct = 1;
						else if (answer.correct !== 'on') correct = 0;

						query = 'SELECT * FROM answers WHERE answer_id = ?';
						results = sql_query(query, [answer.answer_id]).then((res) => {
							if (res.length === 0) {
								query = 'INSERT INTO `answers`(`answer_id`,`answer_name`, `answer_type`, `answer_correct`, `answer_addon`, `answer_addon_src`) VALUES (?,?,?,?,NULL,?)';
								sql_query(query, [answer.answer_id, answer.answer_name, answer.answer_type, correct, answer.answer_addon_src]);

								//creating relation
								query = 'INSERT INTO `questions_answers`(`question_id`, `answer_id`) VALUES (?,?)';
								sql_query(query, [question.question_id, answer.answer_id]);
							} else {
								query =
									'UPDATE  `answers` SET `answer_id`=?,`answer_name`=?, `answer_type`=?, `answer_correct`=?, `answer_addon`=NULL, `answer_addon_src`=? WHERE answer_id=?';
								sql_query(query, [answer.answer_id, answer.answer_name, answer.answer_type, correct, answer.answer_addon_src, answer.answer_id]);
							}
						});
					});
				// console.log('done');
			});

			//creating relation test-users
			emails.map((email) => {
				query = 'SELECT * FROM test_participants where user_email=? AND test_id=?';
				results = sql_query(query, [email, test.test_id]).then((res) => {
					if (res.length === 0) {
						query = 'INSERT INTO test_participants(id,user_email,test_id) VALUES (NULL,?,?)';
						sql_query(query, [email, test.test_id]);
					}
				});
			});
			if (!emails.includes(session.email)) {
				query = 'SELECT * FROM test_participants where user_email=? AND test_id=?';
				results = sql_query(query, [session.email, test_id]).then((res) => {
					if (res.length === 0) {
						query = 'INSERT INTO test_participants(id,user_email,test_id) VALUES (NULL,?,?)';
						results = sql_query(query, [session.email, test_id]);
					}
				});
			}
			return res.json({ status: 200, statusText: 'Test updated successfully' });
		}
	} catch (err) {
		if (err instanceof notFoundException) {
			res.status(err.status).end();
		}
		res.status(500).json({ message: err.message });
	}
};
