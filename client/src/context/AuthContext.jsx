// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../API/axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔴 CHECK SESSION ON PAGE REFRESH
//   useEffect(() => {
//     api.get("/auth/me")
//       .then(res => {
//         if (res.data.loggedIn) {
//           setUser(res.data.user);
//         }
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const login = (userData) => setUser(userData);

//   // 🔴 FIXED LOGOUT ROUTE
//   const logout = async () => {
//     await api.post("/logout");  // ✅ NOT /auth/logout
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// //part 2 
// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../API/axios";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // =======================
//   // CHECK SESSION ON REFRESH
//   // =======================
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.get("/auth/me");

//         if (res.data.loggedIn) {
//           setUser(res.data.user);
//         } else {
//           setUser(null);
//         }
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   // =======================
//   // LOGIN (SET USER)
//   // =======================
//   const login = (userData) => {
//     setUser(userData);
//   };

//   // =======================
//   // LOGOUT (CLEAR SESSION)
//   // =======================
//   const logout = async () => {
//     try {
//       await api.post("/logout");
//       setUser(null);
//     } catch (err) {
//       console.error("Logout failed", err);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // =======================
// // CUSTOM HOOK
// // =======================
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// // part 3

// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../API/axios";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.get("/auth/me");
//         setUser(res.data.loggedIn ? res.data.user : null);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = (userData) => setUser(userData);

//   const logout = async () => {
//     await api.post("/logout");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../API/axios";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.get("/auth/me");
//         setUser(res.data.loggedIn ? res.data.user : null);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const login = (userData) => setUser(userData);

//   const logout = async () => {
//     await api.post("/logout");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import api from "../API/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.loggedIn ? res.data.user : null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
