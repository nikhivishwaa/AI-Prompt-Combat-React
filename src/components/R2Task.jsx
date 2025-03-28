import React, { useEffect, useState } from "react";
import { AuthProvider } from "../context/authContext";
import { EventProvider } from "../context/eventContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

function R2Task({ task, i }) {
  const [image, setImage] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const { participant, challenge, round2, setRound2 } = EventProvider();
  const { token } = AuthProvider();

  const naviagtion = useNavigate();
  useEffect(() => {
    if (task?.evaluated) {
      setSubmit(true);
      setImageSrc(task?.image);
    }
  }, []);
  const handlePreview = (e)=> {
    const file = e.target.files[0];
    console.log({file})
    const img = URL.createObjectURL(file);
    setImageSrc(img);
    setImage(file);
  }

  async function handleSubmission(e) {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image");
      return false;
    }

    const allow = confirm(`You Want to Submit Task #${i} ?`);
    if (!allow) {
      return;
    } else {
      submitTask();
    }
  }
  async function submitTask() {
    try {
      setSubmitting(true);
      const apiUrl = import.meta.env.VITE_BACKEND;
      let form = new FormData();
      form.append("image", image);
      form.append("participant", participant.id);

      const response = await axios.post(
        `${apiUrl}/challenge/${challenge.id}/round2/${task.id}/`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        console.log(response.data);
        const updatedTask = round2.map((t, i) =>
          t.id === task.id
            ? { ...t, evaluated: true, image: response.data.data.image }
            : t
        );
        setRound2(updatedTask);
        secureLocalStorage.setItem("round2", JSON.stringify(updatedTask));
        alert(`Task #${i} submitted successfully`);
      }
      if (response.status === 202) {
        console.log(response.data);
        const updatedTask = round2.map((t, i) =>
          t.id === task.id
            ? {
                ...t,
                evaluated: true,
                image: response.data.data.generated_image,
              }
            : t
        );
        setRound2(updatedTask);
        secureLocalStorage.setItem("round2", JSON.stringify(updatedTask));
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
          <div className="upload-box">
            <label className="form-label">Upload Your Image:</label>
            {submit ? (
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                className="form-control file-input"
                name="user_image"
                onClick={(e) => e.preventDefault()}
                readonly={true}
              />
            ) : (
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handlePreview}
                className="form-control file-input"
                name="user_image"
                required={true}
              />
            )}
          </div>

          <div className="text-center submit-container">
            <button
              type="submit"
              className="btn-primary"
              style={
                task?.evaluated || !image || submit || submitting
                  ? {
                      cursor: "not-allowed",
                      boxShadow: "none",
                      background: "#34e9e9",
                    }
                  : { cursor: "pointer" }
              }
              disabled={task?.evaluated || !image || submit || submitting}
            >
              Submit
            </button>
          </div>
          <div
            className="text-center relative"
            style={!imageSrc ? { display: "none" } : {}}
          >
            <span className="preview-patch">Preview</span>
            <img
              src={imageSrc}
              className="img-fluid reference-img mb-0"
              alt="AI Prompt Combat"
            />
            <div className="preview-overlay"></div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default R2Task;
