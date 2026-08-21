import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Home() {
  const [tweets, setTweets] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTweets = async () => {
    try {
      const res = await API.get("/tweets");
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
    fetchTweets();
  }, []);

  const handlePostTweet = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/tweets", { text });
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
        <h2>Home</h2>
        <div>
          <span style={{ marginRight: "10px" }}>Hi, {user?.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <form onSubmit={handlePostTweet} style={{ marginBottom: "20px" }}>
        <textarea
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", minHeight: "60px" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "8px 16px" }}>Tweet</button>
      </form>

      <div>
        {tweets.map((tweet) => (
          <div key={tweet._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "8px" }}>
            <strong>@{tweet.userId?.username}</strong>
            <p>{tweet.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;