import React from "react";

const Logo = ({ className = "h-8 w-8" }) => {
  return (
    <div
      className={`${className} flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-green-500 rounded-lg shadow-lg relative overflow-hidden`}
    >
      {/* Background pattern for energy/molecule effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
      </div>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5 text-white relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* H2 Symbol for Hydrogen */}
        <text
          x="12"
          y="16"
          textAnchor="middle"
          className="text-[8px] font-bold fill-current"
        >
          H₂
        </text>

        {/* Energy wave/lightning pattern */}
        <path
          d="M6 8L10 4L8 12L14 6L12 16L18 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        />

        {/* Molecular structure dots */}
        <circle
          cx="4"
          cy="12"
          r="1"
          fill="currentColor"
          className="opacity-60"
        />
        <circle
          cx="20"
          cy="12"
          r="1"
          fill="currentColor"
          className="opacity-60"
        />
        <circle
          cx="12"
          cy="4"
          r="1"
          fill="currentColor"
          className="opacity-60"
        />
        <circle
          cx="12"
          cy="20"
          r="1"
          fill="currentColor"
          className="opacity-60"
        />

        {/* Connecting lines for molecular structure */}
        <line
          x1="4"
          y1="12"
          x2="12"
          y2="4"
          stroke="currentColor"
          strokeWidth="0.5"
          className="opacity-40"
        />
        <line
          x1="12"
          y1="4"
          x2="20"
          y2="12"
          stroke="currentColor"
          strokeWidth="0.5"
          className="opacity-40"
        />
        <line
          x1="20"
          y1="12"
          x2="12"
          y2="20"
          stroke="currentColor"
          strokeWidth="0.5"
          className="opacity-40"
        />
        <line
          x1="12"
          y1="20"
          x2="4"
          y2="12"
          stroke="currentColor"
          strokeWidth="0.5"
          className="opacity-40"
        />
      </svg>
    </div>
  );
};

export default Logo;
