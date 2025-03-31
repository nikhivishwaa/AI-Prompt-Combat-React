import React, { useEffect, useState } from "react";
import { AuthProvider } from "../context/authContext";
import { EventProvider } from "../context/eventContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import imageCompression from "browser-image-compression";

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
  const handlePreview = async (e) => {
    const file = e.target.files[0];
    if (file.size > 2621440) {
      try {
        // compress the file if it is more than 2.5MB
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 5,
          useWebWorker: true,
        });

        const lastModified = new Date();
        const name = `TS_${new Date().getTime()}_${
          Math.random() * 1000
        }_${file.name.slice(-10)}`;
        const nfile = new File([compressedFile], name, { lastModified });
        const img = URL.createObjectURL(nfile);
        console.log({ nfile, img });
        setImageSrc(img);
        setImage(nfile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    } else {
      file.name = `TS_${new Date().getTime()}_${
        Math.random() * 1000
      }_${file.name.slice(-10)}`;
      const img = URL.createObjectURL(file);
      console.log({ file, img });
      setImageSrc(img);
      setImage(file);
    }
  };

  async function handleSubmission(e) {
    e.preventDefault();
    if (!image) {
      alert("⚠️ Please upload an image");
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
        setSubmit(true);
        secureLocalStorage.setItem("round2", JSON.stringify(updatedTask));
        alert(`✅ Task #${i} submitted successfully`);
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
        setSubmit(true);
        secureLocalStorage.setItem("round2", JSON.stringify(updatedTask));
        alert(`⚠️ Task #${i} already submitted`);
      }
    } catch (error) {
      console.log("Error while submitting: ", error);
      alert(`❌ Task #${i} is not submitted. Try again!`);
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
            {submit || submitting ? (
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                className="form-control file-input"
                name="user_image"
                onClick={(e) => e.preventDefault()}
                readOnly={true}
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
                task?.evaluated || submit || submitting
                  ? {
                      cursor: "not-allowed",
                      boxShadow: "none",
                      background: "#34e9e9",
                    }
                  : { cursor: "pointer" }
              }
              disabled={task?.evaluated || submit || submitting}
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
