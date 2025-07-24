import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const navigate = useNavigate();

  // Check if logged in
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

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!setAuthHeader()) {
      setWishlist([]);
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

  // Add to wishlist
  const addToWishlist = async (gameId) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    try {
      if (!setAuthHeader()) return;
      await axios.post(`http://localhost:8080/api/wishlist/${gameId}`);
      setFeedback("Game added to wishlist!");
      // Refetch wishlist to keep in sync
      await fetchWishlist();
    } catch (err) {
      console.error(err);
      setFeedback(
        err.response?.data?.error || "Failed to add to wishlist."
      );
    }
    setTimeout(() => setFeedback(null), 2500);
  };

  // Remove from wishlist
  const removeFromWishlist = async (gameId) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    try {
      if (!setAuthHeader()) return;
      await axios.delete(`http://localhost:8080/api/wishlist/${gameId}`);
      setFeedback("Game removed from wishlist!");
      // Refetch wishlist to keep in sync
      await fetchWishlist();
    } catch (err) {
      console.error(err);
      setFeedback(
        err.response?.data?.error || "Failed to remove from wishlist."
      );
    }
    setTimeout(() => setFeedback(null), 2500);
  };

  // Check if game is in wishlist
  const isInWishlist = (gameId) => {
    return wishlist.some(item => item.gameId === gameId);
  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      error,
      feedback,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refetchWishlist: fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
