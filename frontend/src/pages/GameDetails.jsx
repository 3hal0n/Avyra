import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";

const StarRating = ({ value = 5 }) => (
  <span className="text-yellow-400 text-lg" aria-label={`${value} star rating`}>
    {"★".repeat(value).padEnd(5, "☆")}
  </span>
);

const isLoggedIn = () => !!localStorage.getItem("jwtToken");

// Helper to format date nicely
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    wishlist,
    loading: wishlistLoading,
    feedback: wishlistFeedback,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // New review inputs
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [addingReview, setAddingReview] = useState(false);

  const [feedback, setFeedback] = useState({ cart: null, review: null });
  const [addingCart, setAddingCart] = useState(false);

  // Fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/games/${id}`);
        setGame(response.data);
      } catch (err) {
        setGame(null);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  // Fetch reviews for this game
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/reviews", {
        params: { gameId: id },
      });
      setReviews(response.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (game) {
      fetchReviews();
    }
  }, [game]);

  // Cart add handler
  const handleAddCart = async () => {
    if (!isLoggedIn()) return navigate("/login");
    setAddingCart(true);
    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("jwtToken")}`;
      await axios.post(`http://localhost:8080/api/cart/${game.id}?quantity=1`);
      setFeedback((f) => ({ ...f, cart: "Added to cart!" }));
    } catch (err) {
      setFeedback((f) => ({ ...f, cart: "Failed to add to cart." }));
    }
    setTimeout(() => setFeedback((f) => ({ ...f, cart: null })), 2000);
    setAddingCart(false);
  };

  // Wishlist toggle handler
  const handleWishlistToggle = async () => {
    if (!isLoggedIn()) return navigate("/login");
    if (isInWishlist(game.id)) {
      await removeFromWishlist(game.id);
    } else {
      await addToWishlist(game.id);
    }
  };

  // Submit new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      setReviewError("You must be logged in to submit a review.");
      return;
    }
    if (!newComment.trim()) {
      setReviewError("Please enter a comment.");
      return;
    }
    if (newRating < 1 || newRating > 5) {
      setReviewError("Rating must be between 1 and 5.");
      return;
    }

    setAddingReview(true);
    setReviewError(null);

    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("jwtToken")}`;
      await axios.post("http://localhost:8080/api/reviews", {
        gameId: parseInt(id, 10),
        rating: newRating,
        comment: newComment.trim(),
      });
      setReviewSuccess("Review added successfully!");
      setNewComment("");
      setNewRating(5);
      // Refresh review list
      await fetchReviews();
    } catch (err) {
      let msg = "Failed to add review.";
      if (
        err.response &&
        err.response.data &&
        err.response.data.error
      ) {
        msg = err.response.data.error;
      }
      setReviewError(msg);
    }
    setAddingReview(false);
    setTimeout(() => {
      setReviewError(null);
      setReviewSuccess(null);
    }, 4000);
  };

  // Delete review (only if current user owns it)
  const handleReviewDelete = async (reviewId) => {
    if (!isLoggedIn()) return navigate("/login");
    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("jwtToken")}`;
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`);
      // Refresh review list
      await fetchReviews();
    } catch (err) {
      alert("Failed to delete review.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-2xl">
        Loading...
      </div>
    );

  if (!game || Object.keys(game).length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500 text-2xl">
        Game not found.
      </div>
    );

  const wishlistActive = isInWishlist(game.id);
  const currentUsername = (() => {
    try {
      const tokenPayload = JSON.parse(
        atob(localStorage.getItem("jwtToken")?.split(".")[1])
      );
      return tokenPayload?.sub || null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#11002a] to-[#424242]">
      <Navbar />
      {/* Full-bleed BG image with overlay */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-black/60">
        <img
          src={`http://localhost:8080${game.coverUrl}`}
          alt="Backdrop"
          className="w-full h-full object-cover object-center opacity-40 blur-sm select-none"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-[#220146]/70" />
      </div>

      <main className="relative max-w-7xl mx-auto pt-24 pb-10 px-2 flex flex-col lg:flex-row gap-14 lg:gap-20">
        {/* Left: Visual/Trailer */}
        <section className="flex-1 flex flex-col items-center justify-center">
          {/* Trailer if available */}
          {game.trailerUrl ? (
            <div className="w-full rounded-xl overflow-hidden shadow-2xl mb-6 aspect-video bg-black">
              <video
                src={game.trailerUrl}
                poster={`http://localhost:8080${game.coverUrl}`}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full rounded-xl overflow-hidden mb-6 aspect-video shadow-2xl bg-black">
              <img
                src={`http://localhost:8080${game.coverUrl}`}
                alt={game.title}
                className="w-full h-full object-cover scale-105"
              />
            </div>
          )}
        </section>

        {/* Right: Info and CTA */}
        <aside className="flex-1 max-w-xl glassmorphism rounded-2xl shadow-xl p-8 flex flex-col justify-between bg-white/10 backdrop-blur-lg border border-white/20">
          <div>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl tracking-tight font-bold text-white drop-shadow">
                {game.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-lg text-gray-300 mt-2 mb-0.5 select-none">
                <span className="px-3 py-0.5 bg-indigo-900/60 rounded-lg">{game.genres}</span>
                <span className="px-3 py-0.5 bg-violet-900/60 rounded-lg">{game.platforms}</span>
              </div>
              <p className="mt-4 mb-5 text-gray-200 text-base">{game.description}</p>
            </div>
            <div className="flex gap-4 items-end mt-2 mb-4">
              <span className="text-3xl text-green-400 font-bold drop-shadow">${game.price}</span>
              <button
                onClick={handleAddCart}
                className={`px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-all shadow ${
                  addingCart ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={addingCart}
              >
                {feedback.cart ? feedback.cart : addingCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`px-5 py-2 rounded-lg font-semibold text-white transition-all shadow ${
                  wishlistActive ? "bg-pink-500 hover:bg-pink-600" : "bg-pink-600 hover:bg-pink-700"
                }`}
              >
                {wishlistLoading
                  ? "Loading..."
                  : wishlistFeedback
                  ? wishlistFeedback
                  : wishlistActive
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>
            </div>
            {(game.sysreqMin || game.sysreqRec) && (
              <div className="mt-2 p-4 bg-white/10 rounded-xl text-sm text-gray-200 shadow-inner space-y-1 border border-white/10">
                {game.sysreqMin && <div><span className="font-medium">Min:</span> {game.sysreqMin}</div>}
                {game.sysreqRec && <div><span className="font-medium">Recommended:</span> {game.sysreqRec}</div>}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Reviews Section */}
      <section className="max-w-4xl mx-auto mt-3 mb-10 px-2">
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-7">
            <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Player Reviews</h2>
            {isLoggedIn() ? (
              <form
                onSubmit={handleReviewSubmit}
                className="flex flex-col md:flex-row items-end gap-3"
                autoComplete="off"
              >
                {/* Star Rating Selector */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      onClick={() => setNewRating(star)}
                      className={`text-3xl cursor-pointer ${
                        newRating >= star ? "text-yellow-400" : "text-gray-600"
                      } focus:outline-none`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {/* Review Textarea */}
                <textarea
                  className="resize-none rounded bg-gray-800 border border-white/30 text-white px-3 py-1 min-w-[200px] min-h-[36px]"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your review..."
                  maxLength={300}
                  required
                  rows={2}
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg font-bold text-white"
                  disabled={addingReview}
                >
                  {addingReview ? "Posting..." : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="mb-3 text-gray-400">
                <button
                  className="underline text-blue-400"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>{" "}
                to add a review.
              </div>
            )}
          </div>
          {reviewError && <div className="text-red-400 mb-3">{reviewError}</div>}
          {reviewSuccess && <div className="text-green-400 mb-3">{reviewSuccess}</div>}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-white text-center py-4">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-300 text-center py-6">
              No reviews yet. Be the first!
            </div>
          ) : (
            <ul className="space-y-4 divide-y divide-white/10">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-4 py-4"
                  aria-label={`Review by ${r.username} with rating ${r.rating}`}
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center text-white font-bold text-lg select-none">
                    {r.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">{r.username}</span>
                      <StarRating value={r.rating} />
                    </div>
                    <p className="text-gray-200">{r.comment}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(r.createdAt)}
                    </div>
                  </div>
                  {/* Delete button (only for user's own reviews) */}
                  {r.username === currentUsername && (
                    <button
                      onClick={() => handleReviewDelete(r.id)}
                      title="Delete review"
                      className="ml-4 text-red-500 hover:text-red-600"
                      aria-label="Delete your review"
                    >
                      &#x2715;
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default GameDetails;
