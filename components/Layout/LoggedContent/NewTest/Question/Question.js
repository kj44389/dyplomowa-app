import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";
import Answer from "./Answer/Answer";
import Question_addons from "./Question_addons";
import ReactPlayer from "react-player";
import _fetch from "isomorphic-fetch";
import { v4 } from "uuid";

function Question({ props }) {
  const [question, setquestion] = useState(props.question);
  const [uploadingStatus, setUploadingStatus] = useState("pending");
  const answers = props.answers;
  const reader = new FileReader();

  //update questions state
  useEffect(() => {
    props.setquestions(question);
  }, [question]);

  // FILE UPLOAD preparing
  useEffect(() => {
    if (!question.question_addon) return;
    const form = new FormData();
    setUploadingStatus("pending");

    if (question.question_type === "with_youtube") {
      handleQuestionChange("question_addon_src", question.question_addon);
    } else {
      reader.readAsDataURL(question.question_addon);

      if (question.question_type === "with_audio") {
        reader.onload = (e) => {
          handleQuestionChange("question_addon_src", reader.result);
          form.append("audio", question.question_addon);
          handleAddFile(form);
        };
      }
      if (question.question_type === "with_image") {
        reader.onload = (e) => {
          handleQuestionChange("question_addon_src", reader.result);
          form.append("image", question.question_addon);
          handleAddFile(form);
        };
      }
    }
  }, [question.question_addon]);

  // reseting src after type change
  useEffect(() => {
    setquestion({ ...question, question_addon_src: "", question_addon: "" });
  }, [question.question_type]);

  //marking upload as done
  useEffect(() => {
    setUploadingStatus("done");
  }, [question.question_addon_src]);

  // FILE UPLOAD execution
  async function handleAddFile(form) {
    const res = await _fetch(`${absoluteUrlPrefix}/api/test/uploadFile?`, {
      method: "POST",
      body: form,
    });
    let { data, filepath } = await res.json();
    filepath = filepath.replaceAll("\\", "/");
    handleQuestionChange("question_addon_src", filepath);
  }

  function renderQuestionSwitch(type) {
    switch (type) {
      case "text_one":
        return;
      case "text_many":
        return;
      case "with_audio":
        return (
          <Question_addons
            props={{
              type: "audio",
              handleQuestionChange: handleQuestionChange,
              value: "",
            }}
          />
        );
      case "with_image":
        return (
          <Question_addons
            props={{
              type: "image",
              handleQuestionChange: handleQuestionChange,
              value: "",
            }}
          />
        );
      case "with_youtube":
        return (
          <Question_addons
            props={{
              type: "youtube",
              handleQuestionChange: handleQuestionChange,
              value: "",
            }}
          />
        );
    }
  }
  //helper function
  async function handleQuestionChange(what_changing, value) {
    question[`${what_changing}`] = value;
    setquestion({ ...question, [what_changing]: value });
  }

  return (
    <div className="indicator flex flex-col w-full h-auto space-y-6 mt-16 mb-12">
      <div className="indicator-item indicator-top-left indicator-start rounded-bl-none rounded-tl-none badge bg-green-500 badge-md translate-x-[-25%] ml-10 md:ml-0">
        Question {question.id}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Question Type</span>
        </label>
        <select
          onChange={(e) =>
            handleQuestionChange("question_type", e.target.value)
          }
          defaultValue="text_one"
          className="select select-bordered w-full "
        >
          {/* <select onChange={(e) => QuestionChange(question.question_id, 'question_type', e.target.value)} defaultValue='text_one' className='select select-bordered w-full '> */}
          <option value="text_one">Pytanie jednokrotnego wyboru</option>
          <option value="text_many">Pytanie wielokrotnego wyboru</option>
          <option value="with_audio">Z dźwiękiem</option>
          <option value="with_image">Z obrazkiem</option>
          <option value="with_youtube">Z Filmikiem z YT</option>
        </select>
      </div>

      <div className="flex justify-center items-center">
        {question.question_addon_src !== "" &&
          uploadingStatus !== "pending" &&
          question.question_type == "with_image" && (
            <img src={`/${question.question_addon_src}`} className="max-w-sm" />
          )}
        {question.question_addon_src !== "" &&
          uploadingStatus !== "pending" &&
          question.question_type == "with_audio" && (
            <ReactPlayer
              url={`/${question.question_addon_src}`}
              height={70}
              controls
            />
          )}
        {question.question_addon_src !== "" &&
          uploadingStatus !== "pending" &&
          question.question_type == "with_youtube" && (
            <ReactPlayer url={question.question_addon_src} controls />
          )}
      </div>
      {renderQuestionSwitch(question.question_type)}
      {/* question name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Question</span>
        </label>
        <textarea
          className="textarea h-24"
          placeholder="How many people live on Earth?"
          onChange={(e) => {
            handleQuestionChange("question_name", e.target.value);
          }}
        ></textarea>
      </div>
      {/* queston time and points */}
      <div className="form-control flex flex-col md:flex-row w-full md:space-x-2">
        <div className="flex flex-col w-full md:w-1/2">
          <label className="label">
            <span className="label-text">Question Time (s)</span>
          </label>
          <input
            type="time"
            className="input"
            defaultValue={"00:20"}
            onChange={(e) => {
              handleQuestionChange("question_time", e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2">
          <label className="label">
            <span className="label-text">Question points</span>
          </label>
          <input
            type="number"
            placeholder={question.question_score}
            value={question.question_score}
            min={"0"}
            className="input"
            onChange={(e) => {
              handleQuestionChange("question_score", parseInt(e.target.value));
            }}
          />
        </div>
      </div>
      {/* show answers for this question */}
      {answers.length > 0 && (
        <div className="space-y-24 pt-12">
          {answers
            .filter((answer) => {
              return answer.question_id == question.question_id;
            })
            .map((answer, index) => {
              return (
                <Answer
                  key={answer.id}
                  props={{
                    answer: answer,
                    index: index,
                    setanswers: props.setanswers,
                    answers: answers,
                  }}
                />
              );
            })}
        </div>
      )}
      {/* add new answer */}
      <button
        onClick={(e) => {
          props.addAnswer(question.question_id);
        }}
        className="m-4 btn btn-outline btn-sm max-w-[10rem] self-center"
      >
        Dodaj Odpowiedź
      </button>
      <div className="divide border-gray-700 border-[1px]"></div>
    </div>
    // </div>
  );
}

export default Question;