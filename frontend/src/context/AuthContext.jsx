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
    if (username === dummyUser.username && password === dummyUser.password) {
      setIsAuthenticated(true);
      setUser({ username: dummyUser.username, email: dummyUser.email });
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
