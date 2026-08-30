import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AudioTweet() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    setError("");
    setMessage("");
    try {
      const res = await API.post("/api/audio-tweet/request-otp");
      setMessage(res.data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request OTP");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 100 * 1024 * 1024) {
      setError("File must be under 100MB.");
      setFile(null);
      return;
    }

    // quick client-side duration check for better UX
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      if (audio.duration > 300) {
        setError("Audio must be 5 minutes or shorter.");
        setFile(null);
      } else {
        setError("");
        setFile(selected);
      }
    };
    audio.src = URL.createObjectURL(selected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!file) {
      setError("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("otp", otp);

    try {
      await API.post("/api/audio-tweet", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Audio tweet posted!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>← Back to Home</button>
      <h2>Post an Audio Tweet</h2>

      {!otpSent ? (
        <button onClick={handleRequestOtp} style={{ width: "100%", padding: "10px" }}>
          Send OTP to my email
        </button>
      ) : (
        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            required
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
          />
          <button type="submit" style={{ width: "100%", padding: "10px" }}>Post Audio Tweet</button>
        </form>
      )}

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AudioTweet;