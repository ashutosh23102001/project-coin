import { createContext, useContext, useEffect, useState } from "react";
import api from "../API/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔴 CHECK SESSION ON PAGE REFRESH
  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        if (res.data.loggedIn) {
          setUser(res.data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => setUser(userData);

  // 🔴 FIXED LOGOUT ROUTE
  const logout = async () => {
    await api.post("/logout");  // ✅ NOT /auth/logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
