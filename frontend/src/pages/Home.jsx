import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import GameList from "../components/GameList";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import { fetchGames } from "../services/games";
import { mockGames } from "../mockGames";
import { HiSearch } from "react-icons/hi";

function Home() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const activeFilters = [
    genre && { label: genre, onRemove: () => setGenre("") },
    platform && { label: platform, onRemove: () => setPlatform("") },
    minPrice && { label: `Min $${minPrice}`, onRemove: () => setMinPrice("") },
    maxPrice && { label: `Max $${maxPrice}`, onRemove: () => setMaxPrice("") },
  ].filter(Boolean);

  useEffect(() => {
    setLoading(true);
    fetchGames({ search, genre, platform, minPrice, maxPrice })
      .then(setGames)
      .catch(() => {
        // Fallback to mock data if API fails
        let filtered = mockGames;
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(g =>
            g.title.toLowerCase().includes(s) ||
            g.description.toLowerCase().includes(s) ||
            (g.genres && g.genres.toLowerCase().includes(s))
          );
        }
        if (genre) filtered = filtered.filter(g => g.genres && g.genres.includes(genre));
        if (platform) filtered = filtered.filter(g => g.platforms && g.platforms.includes(platform));
        if (minPrice) filtered = filtered.filter(g => g.price >= parseFloat(minPrice));
        if (maxPrice) filtered = filtered.filter(g => g.price <= parseFloat(maxPrice));
        setGames(filtered);
      })
      .finally(() => setLoading(false));
  }, [search, genre, platform, minPrice, maxPrice]);

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Background gradient with animated shift */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-900 via-pink-900 to-pink-700 animate-bgShift"></div>
      
      {/* Scanlines overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 scanlines"
      />

  <main className="relative z-10 min-h-screen pt-20">
        <NavBar />
        <Hero />

        {/* -- Maximum width responsive container for main content -- */}
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 pt-6 pb-16">
          <div className="relative w-full mb-8 flex flex-col items-stretch">
            <div className="w-full flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between rounded-xl border border-pink-600 bg-[#161320]/90 shadow-lg backdrop-blur p-4 md:p-5 transition-all">
              {/* Floating label */}
              <div className="absolute -top-7 left-4 text-xs sm:text-base bg-[#26112e] px-4 py-1 rounded-full shadow font-semibold tracking-wide text-pink-400 border border-pink-700 select-none">
                Find Your Next Game
              </div>
              {/* SearchBar */}
              <div className="flex-1 min-w-0 w-full md:max-w-[60%] relative mb-3 md:mb-0">
                <div className="relative w-full">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 text-xl pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search games, publishers, tags..."
          className="
            pl-10 pr-4 h-12 rounded-lg text-base
            bg-[#171124]/90 border-2 border-pink-600
            focus:border-pink-400 focus:ring-2 focus:ring-pink-400
            shadow transition outline-none placeholder-pink-300 text-white
          "
          aria-label="Search games"
        />
      </div>
    </div>
    {/* Filters */}
    <div className="md:flex-1 min-w-0 w-full flex gap-2 flex-wrap md:justify-end mt-4 md:mt-0">
      <select
        value={genre}
        onChange={e => setGenre(e.target.value)}
        className="
          rounded-lg bg-[#191328] border-2 border-pink-600
          text-white px-4 py-2 text-base
          focus:outline-none focus:border-pink-400
          transition shadow placeholder-pink-300
        "
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {["Action", "Adventure", "RPG", "Indie", "Shooter", "Puzzle"].map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <select
        value={platform}
        onChange={e => setPlatform(e.target.value)}
        className="
          rounded-lg bg-[#191328] border-2 border-pink-600
          text-white px-4 py-2 text-base
          focus:outline-none focus:border-pink-400
          transition shadow placeholder-pink-300
        "
        aria-label="Filter by platform"
      >
        <option value="">All Platforms</option>
        {["PC", "PlayStation", "Xbox", "Switch", "Mobile"].map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
        placeholder="Min $"
        className="
          w-[6rem] rounded-lg bg-[#191328] border-2 border-pink-600
          text-white px-3 py-2 text-base
          focus:outline-none focus:border-pink-400
          placeholder-pink-300 shadow transition
        "
        aria-label="Minimum price filter"
      />
      <input
        type="number"
        min="0"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
        placeholder="Max $"
        className="
          w-[6rem] rounded-lg bg-[#191328] border-2 border-pink-600
          text-white px-3 py-2 text-base
          focus:outline-none focus:border-pink-400
          placeholder-pink-300 shadow transition
        "
        aria-label="Maximum price filter"
      />
    </div>
  </div>
</div>


          {/* -- Games list / loading -- */}
          <section>
            {loading ? (
              <div
                id="products-section"
                className="flex justify-center items-center py-20"
              >
                <div className="px-8 py-3 text-pink-400 bg-gradient-to-r from-transparent via-pink-700/70 to-transparent rounded-2xl shadow animate-pulse font-semibold tracking-wide">
                  Loading games...
                </div>
              </div>
            ) : (
              <GameList games={games} />
            )}
          </section>
        </div>

        {/* Glow accent / underlay */}
        <div
          aria-hidden
          className="pointer-events-none fixed left-1/2 bottom-[-240px] z-0 w-[120vw] h-[400px] -translate-x-1/2 blur-[120px] opacity-50 bg-gradient-to-br from-pink-700 via-fuchsia-700 to-pink-900"
        />

        <Footer />
      </main>

      <style>{`
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bgShift {
          background-size: 200% 200%;
          animation: bgShift 15s ease infinite;
        }
        .scanlines {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.03),
            rgba(255,255,255,0.03) 1px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: screen;
        }
        .neon-glow {
          filter:
            drop-shadow(0 0 6px #ff66cc)
            drop-shadow(0 0 10px #cc33ff);
        }
      `}</style>
    </div>
  );
}

export default Home;
