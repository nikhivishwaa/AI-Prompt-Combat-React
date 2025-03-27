import React, { useState } from "react";
import { AuthProvider } from "../context/authContext";

function R1Task({ task, i }) {
  const [prompt, setPrompt] = useState("");
  const [submit, setSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { participant, challenge, round1, setRound1 } = EventProvider();

  const naviagtion = useNavigate();
  useEffect(() => {
    if (task?.evaluated) setSubmit(true);
  }, []);

  async function handleSubmission(e) {
    e.preventDefault();
    if (prompt.trim() === "") {
      alert("Please write a prompt");
      return false;
    }

    const allow = confirm(`You Want to Submit Task #${idx} ?`);
    if (!allow) {
      return false;
    } else {
      submitTask();
      alert("Something went wrong");
    }
    return false;
  }
  async function submitTask() {
    try {
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
          t.id === task.id ? { ...t, evaluated: true } : t
        );
        setRound1(updatedTask);
        secureLocalStorage.setItem("round1", JSON.stringify(updatedTask));
      }
    } catch (error) {
      console.log("Error while signing in: ", error);
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
            readOnly={submit || submitting}
            required
          ></textarea>
          <div className="text-center submit-container">
            <button
              type="submit"
              className="btn-primary"
              disabled={submit || submitting}
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
