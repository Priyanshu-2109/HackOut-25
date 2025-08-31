import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useModal();

  useEffect(() => {
    if (!isAuthenticated) {
      // Open login modal if user tries to access a protected page
      openLogin();
    }
  }, [isAuthenticated, openLogin]);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
