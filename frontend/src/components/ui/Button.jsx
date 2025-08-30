import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
      "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "text-green-600 hover:bg-green-50 focus:ring-green-500",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${
      disabled || loading
        ? "opacity-50 cursor-not-allowed"
        : "hover:shadow-md transform hover:-translate-y-0.5"
    }
    ${className}
  `.trim();

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <LoadingSpinner size="small" text="" />
          <span className="ml-2">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
