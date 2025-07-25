import React from "react";

export default function Filters({
  genre,
  setGenre,
  platform,
  setPlatform,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  variant = "default",
}) {
  const genres = ["", "Action", "Adventure", "RPG", "Indie", "Shooter", "Puzzle"];
  const platforms = ["", "PC", "PlayStation", "Xbox", "Switch", "Mobile"];

  // Futuristic styling for filter bar
  const selectClasses =
    "rounded-lg bg-[#182136]/90 border-2 border-cyan-700 text-cyan-100 px-4 py-2 text-base focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-600 transition shadow placeholder-cyan-300 neon-glow";
  const inputClasses =
    "w-[6rem] rounded-lg bg-[#15233a]/90 border-2 border-cyan-700 text-cyan-100 px-3 py-2 text-base focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-600 placeholder-cyan-400 shadow transition neon-glow";

  return (
    <div className="flex gap-2 flex-wrap items-center w-full">
      <select
        value={genre}
        onChange={e => setGenre(e.target.value)}
        className={selectClasses}
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {genres.filter(g => g).map(g => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select
        value={platform}
        onChange={e => setPlatform(e.target.value)}
        className={selectClasses}
        aria-label="Filter by platform"
      >
        <option value="">All Platforms</option>
        {platforms.filter(p => p).map(p => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
        placeholder="Min $"
        className={inputClasses}
        aria-label="Minimum price filter"
      />

      <input
        type="number"
        min="0"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
        placeholder="Max $"
        className={inputClasses}
        aria-label="Maximum price filter"
      />
    </div>
  );
}
