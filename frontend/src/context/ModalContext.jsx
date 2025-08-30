import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false); // Close signup if open
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false); // Close login if open
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  const closeAll = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  const switchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const value = {
    isLoginOpen,
    isSignupOpen,
    openLogin,
    openSignup,
    closeLogin,
    closeSignup,
    closeAll,
    switchToSignup,
    switchToLogin,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};
