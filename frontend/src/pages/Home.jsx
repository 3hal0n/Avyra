import Hero from "../components/Hero";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import GameList from "../components/GameList";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import { fetchGames } from "../services/games";

function Home() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchGames({ search, genre, platform, minPrice, maxPrice })
      .then(setGames)
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [search, genre, platform, minPrice, maxPrice]);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <Filters
            genre={genre}
            setGenre={setGenre}
            platform={platform}
            setPlatform={setPlatform}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </div>
        {loading ? (
          <div className="text-center py-10">Loading games...</div>
        ) : (
          <GameList games={games} />
        )}
      </div>

      <Footer />
    </main>
  );
}

export default Home;
