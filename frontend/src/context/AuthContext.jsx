import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null); // Create Initial State

// Create the state provider component
export const AuthProvider = ({ children }) => {
  // JWT Token
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  // Global Login function
  const login = (userToken) => {
    localStorage.setItem("authToken", userToken);
    setToken(userToken);
  };
  // Global Logout Function
  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
  };
  // Context dictionary provided to components
  const value = {
    token,
    isLoggedIn: !!token, // quick check to see if user is logged in
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// A quick hook to quickly access the data
export const useAuth = () => {
  return useContext(AuthContext);
};
