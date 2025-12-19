import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true   // 🔴 REQUIRED FOR SESSION COOKIE
});

export default api;
