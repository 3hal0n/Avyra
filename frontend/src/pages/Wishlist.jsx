import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  // Check if user is logged in based on token presence
  const isLoggedIn = () => !!localStorage.getItem("jwtToken");

  // Set Authorization header for axios globally
  const setAuthHeader = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  };

  // Fetch wishlist items from backend
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
      // Redirect to login if not logged in
      navigate("/login");
    } else {
      fetchWishlist();
    }
  }, [navigate]);

  // Remove a game from wishlist
  const handleRemove = async (gameId) => {
    if (!setAuthHeader()) {
      setError("You need to log in to modify your wishlist.");
      return;
    }
    try {
      setRemovingItemId(gameId);
      await axios.delete(`http://localhost:8080/api/wishlist/${gameId}`);

      // Update local wishlist to remove item immediately
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

  if (loading) {
    return (
      <div className="text-white text-center p-10 min-h-screen flex items-center justify-center">
        Loading your wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 min-h-screen flex flex-col items-center justify-center text-red-500">
        <p>{error}</p>
        {!isLoggedIn() && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-white text-center p-10 min-h-screen flex items-center justify-center">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      <ul className="space-y-4">
        {wishlist.map(({ gameId, title }) => (
          <li
            key={gameId}
            className="flex justify-between items-center bg-gray-800 rounded-lg p-4 shadow"
          >
            <span className="text-lg font-semibold">{title}</span>
            <button
              disabled={removingItemId === gameId}
              onClick={() => handleRemove(gameId)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {removingItemId === gameId ? "Removing..." : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
