import React, { createContext, useContext, useState } from "react";
import { dummyUser } from "../assets/assets";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Accept any credentials for development (non-empty username and password)
    if (
      username &&
      password &&
      username.trim() !== "" &&
      password.trim() !== ""
    ) {
      setIsAuthenticated(true);
      setUser({
        username: username,
        email: username.includes("@") ? username : `${username}@hydrogrid.com`,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const signup = (userData) => {
    // In a real app, this would make an API call
    setIsAuthenticated(true);
    setUser(userData);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
