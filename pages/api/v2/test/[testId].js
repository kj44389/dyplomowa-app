import _fetch from 'isomorphic-fetch';
import sql_query from 'lib/db';
import { getSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { supabase } from 'lib/supabase';

function Exception(status, message) {
	this.status = status;
	this.message = message;
}

const deleteSQL = async ({ query, values }) => {
	return await sql_query(query, values);
};

const handler = async (req, res) => {
	const session = await getSession({ req });
	const test_id = req.query.testId;
	try {
		if (req.method === 'GET') {
			let { data, error, status } = await supabase.from('tests').select('*').eq('test_id', test_id);
			if (error) {
				throw new Exception(404, 'Tests not found!');
			}
			return res.json({ status: 200, data: data });
		} else if (req.method === 'POST') {
			if (!session) throw new Exception(401, 'not authorized to create new test');
			const body = JSON.parse(req.body);
			const questions = body.questions;
			const answers = body.answers;
			const test = body.test;
			let emails = test.emails.split(',');

			for (let i = 0; i < emails.length; i++) {
				emails[i] = emails[i].trim();
			}
			let { data: testData, error: testError } = await supabase.from('tests').insert([
				{
					test_id: test.test_id,
					test_date: test.test_date,
					test_name: test.test_name,
					test_code: test.test_code,
					test_creator: session.id,
					test_type: test.test_type,
				},
			]);

			if (testError) throw new Exception(500, 'Internal server error. Test not created');

			questions.map(async (question) => {
				//inserting questions
				let { data: questionData, error: questionError } = await supabase.from('questions').insert([
					{
						question_id: question.question_id,
						question_name: question.question_name,
						question_score: question.question_score,
						question_time: question.question_time,
						question_type: question.question_type,
						question_addon: null,
						question_addon_src: question.question_addon_src,
					},
				]);

				if (questionError) {
					const { data, error } = await supabase.from('tests').delete().match({ test_id: testData[0]?.test_id });
					throw new Exception(500, `Internal server error. Questions not created. test with id: ${testData[0]?.test_id} deleted successfully`);
				}

				//creating relation test-question
				let { data: tqRelation, error: tqError } = await supabase.from('tests_questions').insert([
					{
						test_id: testData[0]?.test_id,
						question_id: questionData[0]?.question_id,
					},
				]);

				if (tqError) {
					const { data, error } = await supabase.from('tests').delete().match({ test_id: testData[0]?.test_id });
					const { data: data2, error: error2 } = await supabase.from('questions').delete().match({ question_id: testData[0]?.test_id });
					throw new Exception(500, 'Internal server error. Relation test-question not created');
				}

				// inserting answers
				answers
					.filter((answer) => {
						return answer.question_id == question.question_id;
					})
					.map(async (answer) => {
						let correct = 0;
						if (answer.correct === 'on') correct = 1;
						else if (answer.correct !== 'on') correct = 0;
						let { data: answerData, error: answerError } = await supabase.from('answers').insert([
							{
								answer_id: answer.answer_id,
								answer_name: answer.answer_name,
								answer_type: answer.answer_type,
								answer_correct: correct,
								answer_addon: null,
								answer_addon_src: answer.answer_addon_src,
							},
						]);

						let { data: qaRelation, error: qaError } = await supabase.from('questions_answers').insert([
							{
								question_id: questionData[0]?.question_id,
								answer_id: answerData[0]?.answer_id,
							},
						]);
					});
			});

			//creating relation test-users
			emails.map(async (email) => {
				let { data, error } = await supabase.from('test_participants').insert([
					{
						user_email: email,
						test_id: test.test_id,
					},
				]);
			});
			if (!emails.includes(session.email)) {
				let { data, error } = await supabase.from('test_participants').insert([
					{
						user_email: session.email,
						test_id: test.test_id,
					},
				]);
			}
			return res.json({
				status: 200,
				statusText: 'Test created successfully',
			});
		} else if (req.method === 'PATCH') {
			//TODO: delete questions / answers / relations records which have been deleted in the frontend.

			const body = JSON.parse(req.body);
			const questions = body.questions;
			let answers = body.answers;
			const test = body.test;
			let emails = test.emails.split(',');
			if (!session && session.id === test.test_creator) throw new Exception(401, 'not authorized to update test');
			for (let i = 0; i < emails.length; i++) {
				emails[i] = emails[i].trim();
			}

			let { data, error } = await supabase
				.from('tests')
				.update({
					test_id: test.test_id,
					test_date: test.test_date,
					test_name: test.test_name,
					test_code: test.test_code,
					test_creator: test.test_creator,
					test_type: test.test_type,
				})
				.match({ test_id: test.test_id });

			if (error) {
				throw new Exception(500, 'Internal error, unable to update test.');
			}

			// initialize the helper arrays
			let questionsIdArray = [];
			let answersIdArray = [];
			let testQuestionRelation = [];
			let answerQuestionRelation = [];
			let participantsEmails = [];
			let emailsTestRelation = [];

			//get ids
			questions.forEach((question) => questionsIdArray.push(question.question_id));
			answers.forEach((answer) => answersIdArray.push(answer.answer_id));

			//make array of jsons correcsponding to questions / answers in database tables

			questions.forEach((question) => testQuestionRelation.push({ test_id: test.test_id, question_id: question.question_id }));
			answers.forEach((answer) => answerQuestionRelation.push({ answer_id: answer.answer_id, question_id: answer.question_id }));

			// delete id used as helper key in components

			answers = answers.map((item) => {
				delete item.question_id;
				return item;
			});

			//upserting questions / answers records


			let { data: questionPush, error: questionError } = await supabase.from('questions').upsert(questions);
			let { data: answerPush, error: answerError } = await supabase.from('answers').upsert(answers);

			//upserting relations tables

			let { data: questionRelationPush, error: questionRelationError } = await supabase.from('tests_questions').upsert(testQuestionRelation, { onConflict: 'question_id' });
			let { data: answerRelationPush, error: answerRelationError } = await supabase.from('questions_answers').upsert(answerQuestionRelation, { onConflict: 'answer_id' });

			if (questionError || answerError || questionRelationError || answerRelationError) {
				throw new Exception(500, 'Something went wrong during questions / answers update.');
			}

			// upserting participants
			//get participants from database

			let { data: participantsLoaded, error: participantsLoadError } = await supabase.from('test_participants').select('*').in('user_email', emails).eq('test_id', test.test_id);

			// get each participant email from loaded participants from database
			participantsLoaded?.forEach((participant) => participantsEmails.push(participant.user_email));

			// leave only emails which doesnt appear in the database
			emails = emails.filter((email) => !participantsEmails.includes(email));

			//make array of jsons correcsponding to test-participants table in database

			emails.forEach((email) => emailsTestRelation.push({ user_email: email, test_id: test.test_id }));

			//inserting new participants

			let { data: newEmailPush, error: newEmailError } = await supabase.from('test_participants').insert(emailsTestRelation);

			if (newEmailError) {
				throw new Exception(500, 'Something went wrong during participants update.');
			}

			//creating relation test-users
			return res.json({
				status: 200,
				statusText: 'Test updated successfully',
			});
		} else if (req.method === 'DELETE') {
			let query = '';
			if (!session) throw new Exception(401, 'not authorized to delete test');
			const test = await _fetch(`${absoluteUrlPrefix}/api/v2/test/${test_id}`, { method: 'GET' })
				.then((res) => res.json())
				.catch((err) => {
					throw new Exception(404, 'Test not found');
				});

			if (session.id === test.test_creator) throw new Exception(401, 'not authorized to update test');
			let { data, error } = await supabase.from('tests').delete().match({ test_id: test_id });

			res.status(200).json({ status: 200, statusText: 'OK', data: [] });
		} else {
			throw new Exception(405, 'Method not allowed');
		}
	} catch (err) {
		res.status(err.status).json({ status: err.status, statusText: err.message });
	}
};

export default handler;
