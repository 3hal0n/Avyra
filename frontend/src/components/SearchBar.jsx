// frontend/src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search games..."
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
  />
);

export default SearchBar;