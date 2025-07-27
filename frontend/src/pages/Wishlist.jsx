import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  const isLoggedIn = () => !!localStorage.getItem("jwtToken");

  const setAuthHeader = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  };

  const fetchWishlist = async () => {
    if (!setAuthHeader()) {
      setError("You need to log in to view your wishlist.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/wishlist");
      setWishlist(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Failed to load wishlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    } else {
      fetchWishlist();
    }
  }, [navigate]);

  const handleRemove = async (gameId) => {
    if (!setAuthHeader()) {
      setError("You need to log in to modify your wishlist.");
      return;
    }
    try {
      setRemovingItemId(gameId);
      await axios.delete(`http://localhost:8080/api/wishlist/${gameId}`);
      setWishlist((prev) => prev.filter((item) => item.gameId !== gameId));
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Failed to remove item. Please try again."
      );
    } finally {
      setRemovingItemId(null);
    }
  };

  return (
    <>
      <style>{`
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
            text-shadow:
              0 0 5px #0ff,
              0 0 10px #0ff,
              0 0 20px #0ff,
              0 0 40px #07f,
              0 0 80px #07f;
          }
          20%, 22%, 24%, 55% {
            opacity: 0.8;
            text-shadow: none;
          }
        }
        .glassmorphic-card {
          background: rgba(15, 15, 30, 0.7);
          border-radius: 15px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow:
            0 0 8px rgba(0, 255, 255, 0.5),
            inset 0 0 12px rgba(255, 0, 255, 0.2);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: box-shadow 0.3s ease;
        }
        .glassmorphic-card:hover {
          box-shadow:
            0 0 20px cyan,
            inset 0 0 20px magenta;
        }
        .btn-neon {
          color: #0ff;
          border: 1.5px solid #0ff;
          box-shadow:
            0 0 6px #0ff,
            0 0 12px #0ff;
          background: transparent;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          user-select: none;
        }
        .btn-neon:hover:not(:disabled) {
          color: #f0f;
          border-color: #f0f;
          box-shadow:
            0 0 14px #f0f,
            0 0 24px #f0f;
          transform: scale(1.05);
        }
        .btn-neon:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
          color: #088;
          border-color: #088;
        }
        .error-neon {
          border: 1.5px solid #f00;
          background: rgba(255, 0, 0, 0.1);
          box-shadow:
            0 0 6px #f00,
            0 0 8px #f00;
          color: #f00;
          padding: 14px;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .loading-container {
          min-height: 80vh;
        }
        .empty-state {
          color: #0ff;
          opacity: 0.8;
          font-weight: 600;
          font-size: 1.8rem;
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-state svg {
          margin-bottom: 1rem;
          width: 5rem;
          height: 5rem;
          stroke: #0ff;
          stroke-width: 1.8;
          fill: none;
          filter: drop-shadow(0 0 5px #0ff);
          animation: neon-flicker 3s infinite;
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <NavBar />
        <main className="flex-grow max-w-4xl mx-auto p-6 overflow-auto">
          <h1 className="text-4xl font-extrabold mb-8 tracking-wide neon-flicker select-none text-center">
            💖 Your Cyber Wishlist
          </h1>

          {/* Error message */}
          {error && (
            <div className="error-neon" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="loading-container flex items-center justify-center text-xl neon-flicker">
              Loading your wishlist...
            </div>
          ) : wishlist.length === 0 ? (
            // Empty state with icon
            <div className="empty-state" role="status" aria-live="polite">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Your wishlist is empty.
            </div>
          ) : (
            <ul className="space-y-6 flex-grow">
              {wishlist.map(({ gameId, title }) => (
                <li
                  key={gameId}
                  className="glassmorphic-card flex justify-between items-center p-5 transition-shadow cursor-default select-text"
                >
                  <span
                    className="text-lg font-semibold text-cyan-400 truncate"
                    title={title}
                  >
                    {title}
                  </span>
                  <button
                    disabled={removingItemId === gameId}
                    onClick={() => handleRemove(gameId)}
                    className="btn-neon"
                    aria-label={`Remove ${title} from wishlist`}
                  >
                    {removingItemId === gameId ? "Removing..." : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Wishlist;
