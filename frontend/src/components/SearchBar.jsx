import React from "react";

export default function SearchBar({ value, onChange, className = "", placeholder = "", leftIcon }) {
  return (
    <div className="relative w-full">
      {leftIcon}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-12 pr-4 h-14 rounded-xl text-lg bg-[#16202c]/80 border-2 border-cyan-700/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-700 neon-glow shadow-lg outline-none transition-all placeholder-cyan-300 ${className}`}
        aria-label="Search games"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}
