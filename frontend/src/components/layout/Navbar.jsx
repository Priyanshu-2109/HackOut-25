import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { navigationItems } from "../../assets/assets";
import { Bars3Icon, XMarkIcon, BeakerIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { openLogin, openSignup } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const handleLoginClick = () => {
    openLogin();
    closeMenu();
  };

  const handleSignupClick = () => {
    openSignup();
    closeMenu();
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 no-underline group"
              onClick={closeMenu}
            >
              <div className="p-4">
                <BeakerIcon className="h-8 w-8 mt-2 text-blue-600" />
              </div>
              <span className="text-2xl items-center font-bold text-gray-900">
                H2 Infrastructure
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-3 items-center space-x-2">
            {isAuthenticated ? (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 text-sm font-medium no-underline ${
                      isActivePage(item.path)
                        ? "text-blue-700"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center space-x-4 ml-6 pl-6">
                  <div className="flex items-center gap-2 space-x-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      Hello {user?.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 border-0 rounded-2xl px-6 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 text-sm font-medium no-underline ${
                    isActivePage("/")
                      ? "text-blue-700"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Home
                </Link>
                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-sm rounded-2xl font-medium text-gray-700 hover:text-blue-600 no-underline border-0"
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
                  className="px-6 py-2 text-sm rounded-2xl font-medium text-white bg-blue-600 hover:bg-blue-700 no-underline border-0"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-blue-600"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-white">
            {isAuthenticated ? (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 no-underline"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-4 py-3 mt-4 pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user?.username}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-700 px-4 py-3 text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 no-underline"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <button
                  onClick={handleLoginClick}
                  className="block text-left w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 no-underline"
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
                  className="block text-left w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-base font-medium no-underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
