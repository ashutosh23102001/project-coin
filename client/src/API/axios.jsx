
// import axios from "axios";

// const api = axios.create({
//   /* ✅ FIX: correct backend URL */
//   baseURL: "https://project-coin.onrender.com/api",

//   withCredentials: true,

//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;

import axios from "axios";

export default axios.create({
  baseURL: "https://project-coin.onrender.com/api",
  withCredentials: true,
});