import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./pages/Dashboard";
import InfrastructureMap from "./pages/InfrastructureMap";
import Optimization from "./pages/Optimization";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useModal } from "./context/ModalContext";

// Modal Container Component
const ModalContainer = () => {
  const { 
    isLoginOpen, 
    isSignupOpen, 
    closeLogin, 
    closeSignup, 
    switchToSignup, 
    switchToLogin 
  } = useModal();

  return (
    <>
      <Login 
        isOpen={isLoginOpen} 
        onClose={closeLogin}
        onSwitchToSignup={switchToSignup}
      />
      <Signup 
        isOpen={isSignupOpen} 
        onClose={closeSignup}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ModalProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <ProtectedRoute>
                      <InfrastructureMap />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/optimization"
                  element={
                    <ProtectedRoute>
                      <Optimization />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <ModalContainer />
            </div>
          </Router>
        </ModalProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
