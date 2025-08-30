import React from "react";

const Logo = ({ className = "h-8 w-8" }) => {
  return (
    <div
      className={`${className} flex items-center justify-center rounded-lg relative overflow-hidden`}
    >
      {/* Background pattern for energy/molecule effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        viewBox="0 0 24 24"
        fill="#ffffff"
      >
        <path
          fill="none"
          stroke="#4169e1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9.894 3.5v8l-3.66 3.965c-.932 1.265-2.795 3.276-.948 4.622c.568.413 1.615.413 3.71.413h6.009c2.094 0 3.141 0 3.709-.413c1.847-1.346-.016-3.357-.949-4.622l-3.66-3.965v-8m-4.21 0h4.21m-4.21 0H8.84m5.265 0h1.053"
        />
      </svg>
    </div>
  );
};

export default Logo;
