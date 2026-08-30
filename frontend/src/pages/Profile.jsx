import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Profile() {
  const [history, setHistory] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [phone, setPhone] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/auth/login-history").then((res) => setHistory(res.data)).catch(console.log);
    API.get("/api/auth/me").then((res) => setNotificationsEnabled(res.data.notificationsEnabled)).catch(console.log);
  }, []);

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    try {
      await API.put("/api/auth/notifications", { enabled: newValue });
      setNotificationsEnabled(newValue);

      if (newValue && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    setPhoneMessage("");
    try {
      const res = await API.put("/api/auth/phone", { phone });
      setPhoneMessage(res.data.message);
    } catch (err) {
      setPhoneMessage(err.response?.data?.message || "Failed to update phone");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>← Back to Home</button>

      <div style={{ border: "1px solid #555", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} />
          Enable popup notifications (cricket / science tweets)
        </label>
      </div>

      <div style={{ border: "1px solid #555", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <h4>Update Phone Number</h4>
        <form onSubmit={handleUpdatePhone} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button type="submit">Save</button>
        </form>
        {phoneMessage && <p style={{ color: "gray" }}>{phoneMessage}</p>}
      </div>

      <h2>Login History</h2>
      {history.length === 0 && <p>No login history yet.</p>}
      {history.map((h) => (
        <div key={h._id} style={{ border: "1px solid #555", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}>
          <p><b>Browser:</b> {h.browser}</p>
          <p><b>OS:</b> {h.os}</p>
          <p><b>Device:</b> {h.deviceType}</p>
          <p><b>IP:</b> {h.ip}</p>
          <p style={{ color: "gray" }}>{new Date(h.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;