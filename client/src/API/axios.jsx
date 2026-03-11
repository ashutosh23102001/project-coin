
import axios from "axios";

const api = axios.create({
  baseURL: "https://dcoin-api.onrender.com/api",
  withCredentials: true
});

export default api;
