import React, { useEffect, useState } from "react";
import { AuthProvider } from "../context/authContext";
import { EventProvider } from "../context/eventContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

function R1Task({ task, i }) {
  const [prompt, setPrompt] = useState("");
  const [submit, setSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { participant, challenge, round1, setRound1 } = EventProvider();
  const { token } = AuthProvider();

  const naviagtion = useNavigate();
  useEffect(() => {
    if (task?.evaluated) {
      setSubmit(true);
      setPrompt(task.participant);
    }
  }, []);

  async function handleSubmission(e) {
    e.preventDefault();
    if (prompt.trim() === "") {
      alert("Please write a prompt");
      return false;
    }

    const allow = confirm(`You Want to Submit Task #${i} ?`);
    if (!allow) {
      return false;
    } else {
      submitTask();
    }
    return false;
  }
  async function submitTask() {
    try {
      setSubmitting(true);
      const apiUrl = import.meta.env.VITE_BACKEND;
      const response = await axios.post(
        `${apiUrl}/challenge/${challenge.id}/round1/${task.id}/`,
        { prompt, participant: participant.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        console.log(response.data);
        const updatedTask = round1.map((t, i) =>
          t.id === task.id ? { ...t, evaluated: true, prompt } : t
        );
        setRound1(updatedTask);
        secureLocalStorage.setItem("round1", JSON.stringify(updatedTask));
        alert(`Task #${i} submitted successfully`);
      }
      if (response.status === 202) {
        console.log(response.data);
        const updatedTask = round1.map((t, i) =>
          t.id === task.id
            ? {
                ...t,
                evaluated: true,
                prompt: response.data?.data?.prompt,
              }
            : t
        );
        setRound1(updatedTask);
        secureLocalStorage.setItem("round1", JSON.stringify(updatedTask));
        alert(`Task #${i} already submitted`);
      }
    } catch (error) {
      console.log("Error while submitting: ", error);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="question w-[90%] mx-auto" id="task-{i}">
      <h5>
        {i}. {task.title}:
      </h5>
      <p className="text-[12px]">
        <span className="text-red-600">*</span> {task.desc}
      </p>
      <p>{task.task.detail}</p>
      <form method="post" className="w-full" onSubmit={handleSubmission}>
        <div className="w-full">
          <textarea
            className="form-control"
            name="prompt"
            rows="13"
            readOnly={task?.evaluated || submit || submitting}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          ></textarea>
          <div className="text-center submit-container">
            <button
              type="submit"
              className="btn-primary"
              style={
                task?.evaluated || prompt?.length < 30 || submit || submitting
                  ? {
                      cursor: "not-allowed",
                      boxShadow: "none",
                      background: "#34e9e9",
                    }
                  : { cursor: "pointer" }
              }
              disabled={
                task?.evaluated || prompt?.length < 30 || submit || submitting
              }
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default R1Task;
