import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useLanguage } from "../LanguageContext";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "hi", label: "Hindi" },
  { code: "pt", label: "Portuguese" },
  { code: "zh", label: "Chinese" },
  { code: "fr", label: "French" },
];

function LanguageSwitcher() {
  const [selectedLang, setSelectedLang] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("select"); // select -> otp -> done
  const [message, setMessage] = useState("");
  const [via, setVia] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { changeLanguage, t } = useLanguage();

  const handleRequestOtp = async (langCode) => {
  if (loading) return; // block if a request is already in progress
  setLoading(true);
  setSelectedLang(langCode);
  setMessage("");
  try {
    const res = await API.post("/api/language/request-otp", { language: langCode });
    setVia(res.data.via);
    setMessage(res.data.message);
    setStep("otp");
  } catch (err) {
    setMessage(err.response?.data?.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await API.post("/api/language/verify-otp", { language: selectedLang, otp });
      changeLanguage(selectedLang);
      setMessage(res.data.message);
      setStep("done");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", padding: "20px" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>← Back to {t("home")}</button>
      <h2>Change Language</h2>

      {message && (
        <p style={{ padding: "10px", background: "#222", borderRadius: "8px" }}>{message}</p>
      )}

      {step === "select" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {LANGUAGES.map((lang) => (
  <button
    key={lang.code}
    onClick={() => handleRequestOtp(lang.code)}
    disabled={loading}
    style={{ padding: "10px", opacity: loading ? 0.6 : 1 }}
  >
    {loading ? "Sending..." : lang.label}
  </button>
))}
        </div>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp}>
          <p>Enter the OTP sent via {via === "email" ? "email" : "SMS (check backend console for mock SMS)"}:</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "10px 20px" }}>Verify OTP</button>
        </form>
      )}

      {step === "done" && (
        <button onClick={() => navigate("/")} style={{ padding: "10px 20px" }}>
          Go to {t("home")}
        </button>
      )}
    </div>
  );
}

export default LanguageSwitcher;