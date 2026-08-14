
import axios from "axios";

export default axios.create({
  baseURL: "https://project-coin.onrender.com/api",
  withCredentials: true,
});