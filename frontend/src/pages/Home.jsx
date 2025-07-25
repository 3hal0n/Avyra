import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import GameList from "../components/GameList";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import { fetchGames } from "../services/games";
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
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [search, genre, platform, minPrice, maxPrice]);

  return (
    <main className="relative min-h-screen w-screen bg-gradient-to-b from-[#0e1118] via-[#141628] to-[#191e29] text-white">
      <NavBar />
      <Hero />

      {/* -- Maximum width responsive container for main content -- */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 pt-10 pb-12">
        {/* -- Futuristic Search+Filter Bar -- */}
        <div className="relative w-full mb-12 flex flex-col items-stretch">
          <div className="relative w-full flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-cyan-700/30 bg-gradient-to-br from-[#152041]/80 via-[#222464]/80 to-[#151628]/80 shadow-[0_8px_40px_0_rgba(40,255,255,0.08)] backdrop-blur-lg p-6 md:p-8 transition-all">

            {/* Floating label */}
            <div className="absolute -top-7 left-7 text-xs sm:text-base bg-gradient-to-r from-cyan-500/80 to-violet-600/60 px-5 py-1 rounded-full shadow font-semibold tracking-wide text-cyan-100 border border-cyan-600/60 select-none">
              Find Your Next Game
            </div>

            {/* SearchBar (grows to 45–60% of bar) */}
            <div className="flex-1 min-w-0 w-full md:max-w-[60%] relative">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search games, publishers, tags..."
                className="w-full h-14 text-lg bg-[#16202c]/80 border-2 border-cyan-700/60 focus:border-cyan-400 hover:border-violet-400 neon-glow focus:ring-2 focus:ring-cyan-700 transition-all shadow-lg outline-none"
                leftIcon={<HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-2xl pointer-events-none" />}
              />
            </div>

            {/* Filters (takes up to 40% of bar, never below search) */}
            <div className="md:flex-1 min-w-0 w-full flex gap-2 flex-wrap md:justify-end mt-4 md:mt-0">
              <Filters
                genre={genre}
                setGenre={setGenre}
                platform={platform}
                setPlatform={setPlatform}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                variant="bar"
              />
            </div>
          </div>

          {/* -- Active Filter chips -- */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 px-2">
              {activeFilters.map((filter, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-700 via-blue-700 to-fuchsia-600 text-white rounded-full shadow hover:scale-105 transition cursor-pointer"
                  onClick={filter.onRemove}
                  role="button"
                  tabIndex={0}
                  aria-label={`Clear filter ${filter.label}`}
                >
                  {filter.label}
                  <span className="ml-2 text-xl">&times;</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* -- Games list / loading -- */}
        <section>
          {loading ? (
            <div id="products-section" className="flex justify-center items-center py-20">
              <div className="px-8 py-3 text-cyan-200 bg-gradient-to-r from-transparent via-cyan-800/70 to-transparent rounded-2xl shadow animate-pulse font-semibold tracking-wide">
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
        className="pointer-events-none fixed left-1/2 bottom-[-240px] z-0 w-[120vw] h-[400px] -translate-x-1/2 blur-[120px] opacity-50 bg-gradient-to-br from-cyan-700 via-violet-700 to-fuchsia-700"
      />

      <Footer />
    </main>
  );
}

export default Home;
