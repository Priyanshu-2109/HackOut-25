/**
 * Example of how to integrate the new authentication system with your React components
 * This is a reference implementation that shows how to use the AppContext authentication functions
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { validateLoginForm, validateRegistrationForm } from "../../utils/auth";
import GoogleLoginButton from "../ui/GoogleLoginButton";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";

const AuthExample = () => {
  const navigate = useNavigate();
  const {
    loginUser,
    registerUser,
    isLoading,
    authError,
    forgotPassword,
    addNotification,
  } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate form data
    const validation = validateLoginForm({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Prepare login credentials
    const credentials = {
      password: formData.password,
    };

    // Add either username or email
    if (formData.email) {
      credentials.email = formData.email;
    } else {
      credentials.username = formData.username;
    }

    // Attempt login
    const result = await loginUser(credentials);

    if (result.success) {
      // Login successful - user will be redirected automatically by the context
      navigate("/dashboard");
    } else {
      setFormErrors({ general: result.error });
    }
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form data
    const validation = validateRegistrationForm(formData);

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Prepare registration data
    const userData = {
      username: formData.username,
      email: formData.email,
      fullname: formData.fullname,
      password: formData.password,
    };

    // Attempt registration
    const result = await registerUser(userData);

    if (result.success) {
      // Registration successful - user will be redirected automatically
      navigate("/dashboard");
    } else {
      setFormErrors({ general: result.error });
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setFormErrors({ email: "Email is required for password reset" });
      return;
    }

    const result = await forgotPassword(formData.email);

    if (result.success) {
      setShowForgotPassword(false);
      setFormData({ ...formData, email: "" });
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    // This will redirect to Google OAuth
    // The loginWithGoogle function from the context handles the redirect
    addNotification({
      type: "info",
      message: "Redirecting to Google...",
      duration: 2000,
    });
  };

  // Render forgot password form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email to receive a password reset link
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`relative block w-full px-3 py-2 border ${
                  formErrors.email ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Send Reset Link"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main auth form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormErrors({});
                setFormData({
                  username: "",
                  email: "",
                  fullname: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp
                ? "sign in to existing account"
                : "create a new account"}
            </button>
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={isSignUp ? handleRegister : handleLogin}
        >
          <div className="space-y-4">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required={isSignUp}
                className={`relative block w-full px-3 py-2 border ${
                  formErrors.username ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {formErrors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.username}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required={isSignUp}
                className={`relative block w-full px-3 py-2 border ${
                  formErrors.email ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Full name field (only for signup) */}
            {isSignUp && (
              <div>
                <label htmlFor="fullname" className="sr-only">
                  Full Name
                </label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  autoComplete="name"
                  required
                  className={`relative block w-full px-3 py-2 border ${
                    formErrors.fullname ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                />
                {formErrors.fullname && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.fullname}
                  </p>
                )}
              </div>
            )}

            {/* Password field */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                className={`relative block w-full px-3 py-2 border ${
                  formErrors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Confirm password field (only for signup) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`relative block w-full px-3 py-2 border ${
                    formErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* General error message */}
          {(formErrors.general || authError) && (
            <div className="text-sm text-red-600 text-center">
              {formErrors.general || authError}
            </div>
          )}

          {/* Forgot password link (only for login) */}
          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google login button */}
            <GoogleLoginButton
              text={isSignUp ? "Sign up with Google" : "Sign in with Google"}
              onClick={handleGoogleLogin}
              className="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthExample;
