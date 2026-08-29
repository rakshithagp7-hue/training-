import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await API.post("/forgot-password", { identifier });
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Registered email or phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      <p style={{ marginTop: "10px" }}>
        <Link to="/login">← Back to Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;