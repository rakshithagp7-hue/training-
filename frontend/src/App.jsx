import LanguageSwitcher from "./pages/LanguageSwitcher";
import AudioTweet from "./pages/AudioTweet";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Subscription from "./pages/Subscription";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/language" element={<LanguageSwitcher />} />
      <Route path="/audio-tweet" element={<AudioTweet />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;