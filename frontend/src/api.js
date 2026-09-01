import axios from "axios";

const API = axios.create({
  baseURL: "https://training-1-gpwl.onrender.com/api", // Replace with your backend URL
});

// Automatically attach token to every request if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;