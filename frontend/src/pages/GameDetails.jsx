import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/games/${id}`);
        setGame(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch game:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  useEffect(() => {
    if (game) {
      console.log("✅ Game fetched:", game);
    }
  }, [game]);

  if (loading) return <div className="text-center text-white p-10">Loading...</div>;

  if (!game || Object.keys(game).length === 0) {
    return <div className="text-center text-red-500 p-10">Game not found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto text-white p-6">
        <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
        <img
          src={`http://localhost:8080${game.coverUrl}`}
          alt={game.title}
          className="w-full h-96 object-cover rounded-md shadow-lg mb-6"
        />
        <p className="text-lg mb-4">
          <strong>Description:</strong>
          <br />
          {game.description}
        </p>
        <p className="mb-2">
          <strong>Genres:</strong> {game.genres}
        </p>
        <p className="mb-2">
          <strong>Platforms:</strong> {game.platforms}
        </p>
        <p className="mb-2 text-green-400 font-semibold text-xl">${game.price}</p>
        {game.sysreqMin && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Minimum Requirements</h2>
            <p className="text-sm">{game.sysreqMin}</p>
          </div>
        )}
        {game.sysreqRec && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Recommended Requirements</h2>
            <p className="text-sm">{game.sysreqRec}</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GameDetails;
