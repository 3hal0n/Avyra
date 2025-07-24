import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if logged in by presence of token and fetch user info
  const checkAuth = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get("http://localhost:8080/api/auth/me");
      setUser(res.data);
    } catch (err) {
      // Token invalid or expired
      localStorage.removeItem("jwtToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount: init user state
  useEffect(() => {
    checkAuth();
  }, []);

  // Login handler (store token, fetch user)
  const login = async (token) => {
    localStorage.setItem("jwtToken", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await checkAuth();
    navigate("/");
  };

  // Logout handler (clear token and user)
  const logout = () => {
    localStorage.removeItem("jwtToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
