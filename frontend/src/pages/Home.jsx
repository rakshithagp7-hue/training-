import { useLanguage } from "../LanguageContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Home() {
  const { t } = useLanguage();
  const [tweets, setTweets] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

    const fetchTweets = async () => {
    try {
      const res = await API.get("/api/tweets");

      const notifiedIds = JSON.parse(localStorage.getItem("notifiedTweetIds") || "[]");

      res.data.forEach((t) => {
        if (!notifiedIds.includes(t._id) && t.text && /cricket|science/i.test(t.text)) {
           if (Notification.permission === "granted" && notificationsEnabled) {
            new Notification("New tweet!", { body: t.text });
          }
          notifiedIds.push(t._id);
        }
      });

      localStorage.setItem("notifiedTweetIds", JSON.stringify(notifiedIds));
      setTweets(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  if (!localStorage.getItem("token")) {
    navigate("/login");
    return;
  }
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }

  API.get("/api/auth/me").then((res) => setNotificationsEnabled(res.data.notificationsEnabled));

  fetchTweets();
  const interval = setInterval(fetchTweets, 5000); // poll every 5s for new tweets
  return () => clearInterval(interval);
}, []);

  const handlePostTweet = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/api/tweets", { text });
      setText("");
      fetchTweets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post tweet");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{t("home")}</h2>
        <div>
          <span style={{ marginRight: "10px" }}>Hi, {user?.username}</span>
          <button onClick={() => navigate("/subscription")} style={{ marginRight: "10px" }}>Subscription</button>
          <button onClick={() => navigate("/profile")} style={{ marginRight: "10px" }}>Profile</button>
          <button onClick={() => navigate("/audio-tweet")} style={{ marginRight: "10px" }}>Audio Tweet</button>
          <button onClick={() => navigate("/language")} style={{ marginRight: "10px" }}>Language</button>
          <button onClick={handleLogout}>{t("logout")}</button>
        </div>
      </div>

      <form onSubmit={handlePostTweet} style={{ marginBottom: "20px" }}>
        <textarea
          placeholder={t("whatsHappening")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", minHeight: "60px" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "8px 16px" }}>{t("tweet")}</button>
      </form>

      <div>
        {tweets.map((tweet) => (
          <div key={tweet._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "8px" }}>
            <strong>@{tweet.userId?.username}</strong>
            {tweet.type === "audio" ? (
              <audio
                controls
                src={`${API.defaults.baseURL.replace("/api", "")}${tweet.audioUrl}`}
                style={{ display: "block", width: "100%", marginTop: "8px" }}
              />
            ) : (
              <p>{tweet.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;