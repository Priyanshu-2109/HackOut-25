import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Dashboard from "./pages/Dashboard";
import ComprehensiveDashboard from "./pages/ComprehensiveDashboardSimple";
import InfrastructureMapEnhanced from "./pages/InfrastructureMapEnhanced";
import Optimization from "./pages/Optimization";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useModal } from "./context/ModalContext";
import { initializeGlobalButtonTracking } from "./utils/globalButtonEnhancer";

// Modal Container Component with blurred backdrop
const ModalContainer = React.memo(() => {
  const { isLoginOpen, isSignupOpen, closeAll } = useModal();

  const isOpen = isLoginOpen || isSignupOpen;
  
  React.useEffect(() => {
    // Lock body scroll while modal is open
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeAll]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeAll}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="Close"
          className="absolute -top-3 -right-3 bg-white rounded-full shadow p-2 text-gray-600 hover:text-gray-800 border"
          onClick={closeAll}
        >
          ✕
        </button>
        <Login
          onClose={closeAll}
          isModal={true}
          startWithSignup={isSignupOpen}
          key="login-modal"
        />
      </div>
    </div>
  );
});

function App() {
  // Initialize global button tracking on app load
  React.useEffect(() => {
    initializeGlobalButtonTracking();
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <ModalProvider>
            <Router>
              <div className="App">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/** Auth modals are handled globally via ModalContainer; no standalone /login page */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/comprehensive-dashboard"
                    element={
                      <ProtectedRoute>
                        <ComprehensiveDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/map"
                    element={
                      <ProtectedRoute>
                        <InfrastructureMapEnhanced />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/optimization"
                    element={<Optimization />}
                  />
                  <Route
                    path="/optimization-protected"
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
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
