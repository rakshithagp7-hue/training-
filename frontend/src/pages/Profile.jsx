import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Profile() {
  const [history, setHistory] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/login-history").then((res) => setHistory(res.data)).catch(console.log);
    API.get("/auth/me").then((res) => setNotificationsEnabled(res.data.notificationsEnabled)).catch(console.log);
  }, []);

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    try {
      await API.put("/auth/notifications", { enabled: newValue });
      setNotificationsEnabled(newValue);

      if (newValue && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } catch (err) {
      console.log(err);
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