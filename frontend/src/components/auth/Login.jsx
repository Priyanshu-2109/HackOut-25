import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { FaGoogle } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Login = React.memo(({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    // Optional: Add console.log for debugging (remove in production)
    // console.log(`Field ${name} changed to:`, value);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      try {
        if (isSignUp) {
          // Use signup function for registration
          const success = signup({
            username: formData.username,
            email: formData.email,
          });
          if (success) {
            if (onClose) onClose();
            navigate("/dashboard");
          } else {
            setError("Registration failed");
          }
        } else {
          // Login
          const success = login(
            formData.email || formData.username,
            formData.password
          );
          if (success) {
            if (onClose) onClose();
            navigate("/dashboard");
          } else {
            setError("Invalid credentials");
          }
        }
      } catch (err) {
        setError("An error occurred");
      }
    },
    [isSignUp, formData, login, signup, onClose, navigate]
  );

  const handleGoogleLogin = useCallback(async () => {
    try {
      // Simulate Google login/signup
      const success = signup({
        username: "Google User",
        email: "user@google.com",
      });
      if (success) {
        if (onClose) onClose();
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Failed to login with Google");
    }
  }, [signup, onClose, navigate]);

  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isModal]);

  const backdropVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.3 } },
    }),
    []
  );

  const formVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.2, ease: "easeOut" },
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2, ease: "easeIn" },
      },
    }),
    []
  );

  const FormContent = React.useMemo(
    () => (
      <motion.form
        onClick={(e) => isModal && e.stopPropagation()}
        className={`${
          isModal
            ? "bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 text-gray-900 relative border"
            : "bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto"
        }`}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onSubmit={handleSubmit}
      >
        {isModal && onClose && (
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none p-0"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            {isSignUp ? "Create Account" : "Welcome back!"}
          </h1>
          <p className="text-sm text-center mb-6 text-gray-600">
            {isSignUp
              ? "Join HydroGrid platform"
              : "Please sign in to continue"}
          </p>
        </div>

        {isSignUp && (
          <input
            name="username"
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg mb-4 transition-colors bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-green-500"
            value={formData.username}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-3 rounded-lg mb-4 transition-colors bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-green-500"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg mb-4 transition-colors bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-green-500"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {!isSignUp && (
          <p className="text-sm text-right cursor-pointer mb-4 transition-colors text-green-600 hover:text-green-500">
            Forgot password?
          </p>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 text-md font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md"
        >
          {isSignUp ? "Create Account" : "Sign In"}
        </button>

        {/* Separator Line */}
        <div className="flex items-center gap-2 my-6">
          <div className="w-full h-px bg-gray-300"></div>
          <span className="text-sm whitespace-nowrap text-gray-500">OR</span>
          <div className="w-full h-px bg-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg mb-4 transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <FaGoogle size={20} className="text-blue-500" />
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span
                className="cursor-pointer transition-colors text-green-600 hover:text-green-500"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </span>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <span
                className="cursor-pointer transition-colors text-green-600 hover:text-green-500"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </motion.form>
    ),
    [
      isModal,
      onClose,
      isSignUp,
      formData,
      error,
      handleSubmit,
      handleGoogleLogin,
      formVariants,
    ]
  );

  // If it's a modal, wrap in backdrop
  if (isModal) {
    return (
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4"
        onClick={onClose}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {FormContent}
      </motion.div>
    );
  }

  // Otherwise render as a page
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">{FormContent}</div>
    </div>
  );
});

export default Login;
