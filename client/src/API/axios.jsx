
// import axios from "axios";

// const api = axios.create({
//   baseURL:"http://localhost:3002/api",
//   withCredentials: true
// });

// export default api;



// after deployment

import axios from "axios";

const api = axios.create({
  // ⭐ FIX: Changed from localhost to your Render URL
  baseURL: "https://project-coin.onrender.com/api", 
  withCredentials: true
});

export default api;