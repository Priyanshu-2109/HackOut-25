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
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Dashboard from "./pages/Dashboard";
import InfrastructureMap from "./pages/InfrastructureMap";
import Optimization from "./pages/Optimization";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useModal } from "./context/ModalContext";

// Modal Container Component
const ModalContainer = React.memo(() => {
  const { isLoginOpen, isSignupOpen, closeLogin, closeSignup } = useModal();

  if (!isLoginOpen && !isSignupOpen) {
    return null;
  }

  return (
    <Login
      onClose={isLoginOpen ? closeLogin : closeSignup}
      isModal={true}
      key="login-modal"
    />
  );
});

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
              <Footer />
              <ModalContainer />
            </div>
          </Router>
        </ModalProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
