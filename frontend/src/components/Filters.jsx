// frontend/src/components/Filters.jsx
import React from "react";

const genres = ["Action", "Adventure", "RPG", "Strategy", "Shooter", "Puzzle"];
const platforms = ["PC", "PlayStation", "Xbox", "Switch", "Mobile"];

const Filters = ({ genre, setGenre, platform, setPlatform, minPrice, setMinPrice, maxPrice, setMaxPrice }) => (
  <div className="flex flex-wrap gap-4 items-center">
    <select value={genre} onChange={e => setGenre(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-600">
      <option value="">All Genres</option>
      {genres.map(g => <option key={g} value={g}>{g}</option>)}
    </select>
    <select value={platform} onChange={e => setPlatform(e.target.value)} className="p-2 rounded bg-gray-900 text-white border border-gray-600">
      <option value="">All Platforms</option>
      {platforms.map(p => <option key={p} value={p}>{p}</option>)}
    </select>
    <input
      type="number"
      placeholder="Min Price"
      value={minPrice}
      onChange={e => setMinPrice(e.target.value)}
      className="w-24 p-2 rounded border border-gray-600 bg-gray-900 text-white"
      min="0"
    />
    <input
      type="number"
      placeholder="Max Price"
      value={maxPrice}
      onChange={e => setMaxPrice(e.target.value)}
      className="w-24 p-2 rounded border border-gray-600 bg-gray-900 text-white"
      min="0"
    />
  </div>
);

export default Filters;