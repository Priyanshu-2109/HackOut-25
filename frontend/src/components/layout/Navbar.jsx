import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { navigationItems } from "../../assets/assets";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../ui/Logo";

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
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full z-50 top-0 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 no-underline group"
              onClick={closeMenu}
            >
              <Logo className="h-10 w-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 bg-clip-text text-transparent">
                GreenInfra
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium no-underline transition-colors duration-200 ${
                      isActivePage(item.path)
                        ? "text-green-600 bg-green-50 rounded-lg"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center gap-7 space-x-4 ml-8 pl-8 border-l border-gray-200">
                  <div className="flex items-center gap-2 space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-medium no-underline transition-colors duration-200 ${
                    isActivePage("/")
                      ? "text-green-600 bg-green-50 rounded-lg"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg"
                  }`}
                >
                  Home
                </Link>
                <div className="flex items-center space-x-3 ml-6">
                  <button
                    onClick={handleLoginClick}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 rounded-lg transition-all duration-200 shadow-sm"
                  >
                    Sign In
                  </button>
                </div>
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
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-green-600 no-underline"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <button
                  onClick={handleLoginClick}
                  className="block text-left w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 text-base font-medium no-underline rounded-lg mx-4 mt-2"
                >
                  Sign In
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
