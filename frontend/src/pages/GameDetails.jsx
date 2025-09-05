import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { mockGames } from '../mockGames';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

const StarRating = ({ value = 5 }) => (
  <span aria-label={`${value} star rating`} className="text-yellow-400 text-xl">
    {"★".repeat(value).padEnd(5, "☆")}
  </span>
);

// Removed duplicate useEffect outside the component

const formatDate = (isoString) =>
  isoString
    ? new Date(isoString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const VideoPlayer = ({ url, poster, muted, onLoadedMetadata }) => {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return (
      <iframe
        title="YouTube Trailer"
        className="w-full rounded-lg"
        style={{ aspectRatio: "16/9", minHeight: 360, maxHeight: 450 }}
        src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&mute=${muted ? 1 : 0}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return (
      <iframe
        title="Vimeo Trailer"
        className="w-full rounded-lg"
        style={{ aspectRatio: "16/9", minHeight: 360, maxHeight: 450 }}
        src={`https://player.vimeo.com/video/${videoId}?autoplay=0&muted=${muted ? 1 : 0}`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      src={url}
      poster={poster}
      muted={muted}
      controls
      preload="metadata"
      onLoadedMetadata={onLoadedMetadata}
      className="w-full rounded-lg bg-black"
      style={{ aspectRatio: "16/9", minHeight: 360, maxHeight: 450 }}
    />
  );
};

const TrailerGallery = ({ trailers = [], coverUrl }) => {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);

  if (!trailers.length) return null;

  const handleMuteToggle = () => setMuted((m) => !m);

  return (
    <section className="w-full flex flex-col">
      <div className="w-full rounded-xl shadow-xl border-2 border-pink-800 bg-black relative overflow-hidden mb-4">
        <VideoPlayer url={trailers[active].videoUrl} poster={coverUrl} muted={muted} />
        <button
          onClick={handleMuteToggle}
          className="absolute top-2 right-2 bg-pink-700 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full p-1 focus:outline-none"
          aria-label={muted ? "Unmute video" : "Mute video"}
          title={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5v14l7-7-7-7Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m3-8v8" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5v14l7-7-7-7Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a9 9 0 010 12.73m-3.84-5.12a5 5 0 010 6.36" />
            </svg>
          )}
        </button>
      </div>

      {trailers.length > 1 && (
        <div className="flex gap-2 mb-1 overflow-x-auto scrollbar-thin scrollbar-thumb-pink-700 scrollbar-track-transparent select-none">
          {trailers.map((t, i) => (
            <button
              key={t.videoUrl + i}
              onClick={() => setActive(i)}
              aria-label={`Play trailer ${i + 1}`}
              className={`rounded-lg border-2 overflow-hidden focus:outline-none flex-shrink-0 cursor-pointer transition-all ${
                i === active ? "border-pink-500 scale-110 shadow-neon" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ width: 110, height: 64 }}
            >
              <VideoPlayer
                url={t.videoUrl}
                poster={coverUrl}
                muted={true}
                onLoadedMetadata={(e) => (e.currentTarget.currentTime = 2)}
              />
            </button>
          ))}
        </div>
      )}
      <p className="mt-1 text-center text-pink-300 text-xs truncate">{trailers[active].description || `Trailer ${active + 1}`}</p>
    </section>
  );
};

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [currentUsername, setCurrentUsername] = useState(null);

  // Decode JWT to get current username once
  useEffect(() => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUsername(payload.sub);
      }
    } catch {
      setCurrentUsername(null);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const gameRes = await api.get(`/api/games/${id}`);
        setGame(gameRes.data);

        const trailersRes = await api.get(`/api/game_trailers`, { params: { gameId: id } });
        setTrailers(trailersRes.data || []);

        const reviewsRes = await api.get(`/api/reviews`, { params: { gameId: id } });
        setReviews(reviewsRes.data || []);
      } catch {
        // Fallback to mock data if API fails
        const mock = mockGames.find(g => g.id === id);
        setGame(mock || null);
        setTrailers([]); // Optionally, add mock trailers here
        setReviews([]); // Optionally, add mock reviews here
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  if (!game)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Game not found.
      </div>
    );

  const handleAddCart = async () => {
    if (!localStorage.getItem("jwtToken")) return navigate("/login");

    try {
      await api.post(
        `/api/cart/${game.id}?quantity=1`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
      );
      alert("Added to cart!");
    } catch {
      alert("Failed to add to cart.");
    }
  };

  const toggleWishlist = async () => {
    if (!localStorage.getItem("jwtToken")) return navigate("/login");

    try {
      if (isInWishlist(game.id)) {
        await removeFromWishlist(game.id);
      } else {
        await addToWishlist(game.id);
      }
    } catch {
      alert("Wishlist operation failed.");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("jwtToken")) {
      setReviewError("You need to login to submit a review.");
      return;
    }

    if (!newReview.comment.trim()) {
      setReviewError("Please enter a comment.");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      setReviewError("Rating must be between 1 and 5.");
      return;
    }

    setSubmitting(true);
    setReviewError(null);

    try {
      await api.post(
        "/api/reviews",
        {
          gameId: game.id,
          rating: newReview.rating,
          comment: newReview.comment.trim(),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
      );

      setReviewSuccess("Review submitted successfully!");
      setNewReview({ rating: 5, comment: "" });

      // refresh reviews list
      const reviewsRes = await api.get(`/api/reviews`, { params: { gameId: game.id } });
      setReviews(reviewsRes.data);
    } catch (error) {
      setReviewError(error.response?.data?.message || "Failed to submit the review.");
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setReviewError(null);
        setReviewSuccess(null);
      }, 5000);
    }
  };

  // Delete review handler
  const deleteReview = async (reviewId) => {
    if (!localStorage.getItem("jwtToken")) return navigate("/login");

    if (!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      await api.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });

      // Refresh reviews list after delete
      const reviewsRes = await api.get(`/api/reviews`, { params: { gameId: game.id } });
      setReviews(reviewsRes.data);
    } catch {
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white select-none">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#120026] via-[#43114e] to-[#731559] animate-bgShift -z-10" />
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <Navbar />

  <main className="relative z-30 max-w-7xl mx-auto p-2 sm:p-4 pt-32 lg:pt-40 flex flex-col lg:flex-row gap-8 lg:gap-12 flex-nowrap items-start">
        {/* Left: Trailer + Add Review + Reviews */}
  <aside className="w-full lg:w-[520px] flex-shrink-0 mb-6 lg:mb-0 flex flex-col gap-6 order-2 lg:order-none">
          <TrailerGallery trailers={trailers} coverUrl={game.coverUrl} />

          {/* Add Review Form */}
          <section className="bg-black bg-opacity-70 backdrop-blur-md rounded-xl border border-pink-700 p-6 shadow-lg flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white mb-3">Add Your Review</h2>
            <form onSubmit={submitReview} className="flex flex-col space-y-3">
              <label className="flex items-center space-x-2">
                <span className="text-white select-none">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} stars`}
                    onClick={() => setNewReview((r) => ({ ...r, rating: star }))}
                    className={`text-3xl ${newReview.rating >= star ? "text-yellow-400" : "text-gray-600"}`}
                  >
                    ★
                  </button>
                ))}
              </label>
              <textarea
                aria-label="Write your review"
                value={newReview.comment}
                onChange={(e) => setNewReview((r) => ({ ...r, comment: e.target.value }))}
                maxLength={300}
                placeholder="Write your review here..."
                className="resize-none rounded p-2 bg-gray-800 text-white border border-gray-700"
                rows={3}
                required
              />
              {reviewError && <p className="text-red-500">{reviewError}</p>}
              {reviewSuccess && <p className="text-green-500">{reviewSuccess}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="bg-pink-600 hover:bg-pink-700 text-white rounded py-2 disabled:opacity-50 transition"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </section>

          {/* Reviews List */}
          <section className="bg-black bg-opacity-70 backdrop-blur-md rounded-xl border border-pink-700 p-6 shadow-lg max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-700 scrollbar-track-transparent">
            <h2 className="text-xl font-bold text-white mb-4">Player Reviews</h2>
            {reviewLoading ? (
              <p className="text-white">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-pink-300">No reviews yet. Be the first to review!</p>
            ) : (
              <ul className="space-y-4 divide-y divide-gray-700">
                {reviews.map((rev) => (
                  <li key={rev.id} className="py-3">
                    <div className="flex items-start justify-between space-x-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-700 text-white rounded-full flex items-center justify-center font-bold select-none">
                          {rev.username?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold select-none text-white">{rev.username}</p>
                          <StarRating value={rev.rating} />
                          <p className="text-gray-300">{rev.comment}</p>
                          <p className="text-xs text-gray-500">{formatDate(rev.createdAt)}</p>
                        </div>
                      </div>
                      {rev.username === currentUsername && (
                        <button
                          onClick={() => deleteReview(rev.id)}
                          title="Delete your review"
                          className="text-red-500 hover:text-red-600 font-bold ml-2"
                          aria-label="Delete review"
                        >
                          &#x2715;
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>

  {/* Right: Game info/main content */}
  <section className="flex-grow min-w-0 w-full max-w-2xl bg-black bg-opacity-70 backdrop-blur-md rounded-xl border border-pink-700 p-4 sm:p-6 shadow-lg flex flex-col gap-4 sm:gap-5 overflow-y-auto max-h-[90vh] order-1 lg:order-none mb-4 lg:mb-0">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full rounded-lg max-h-48 object-cover select-none"
            draggable={false}
            style={{ maxWidth: '100%' }}
          />

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-pink-600 to-pink-700 bg-clip-text text-transparent drop-shadow-lg mb-1 flex flex-wrap items-center gap-x-3">
            {game.title}
            {avgRating && (
              <span className="align-middle inline-flex items-center text-pink-400 text-lg font-bold whitespace-nowrap">
                <StarRating value={Math.round(avgRating)} />
                <span className="ml-1">{avgRating}/5</span>
                <span className="ml-2 text-xs text-gray-400">({reviews.length} reviews)</span>
              </span>
            )}
          </h1>

          <div className="flex flex-wrap gap-3 select-none">
            <span className="bg-pink-900/80 rounded-full px-3 py-1 text-pink-300 text-sm">{game.genres}</span>
            <span className="bg-pink-900/80 rounded-full px-3 py-1 text-pink-300 text-sm">{game.platforms}</span>
          </div>

          <p className="max-h-72 overflow-y-auto text-gray-300 p-2 rounded border border-gray-700 scrollbar-thin scrollbar-thumb-pink-700">
            {game.description}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-3xl font-bold text-green-400">${game.price.toFixed(2)}</span>
            <button onClick={handleAddCart} className="bg-blue-600 hover:bg-pink-600 transition-colors rounded px-6 py-2 text-white">
              Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                isInWishlist(game.id) ? "bg-pink-500 hover:bg-pink-600" : "bg-pink-700 hover:bg-pink-800"
              } text-white`}
            >
              {isInWishlist(game.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {(game.sysreqMin || game.sysreqRec) && (
            <div className="bg-pink-900/30 rounded p-3 text-sm text-pink-300 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-pink-700">
              {game.sysreqMin && <p><strong>Min:</strong> {game.sysreqMin}</p>}
              {game.sysreqRec && <p><strong>Recommended:</strong> {game.sysreqRec}</p>}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes bgShift {
          0% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }
        .animate-bgShift {
          background-size: 200% 200%;
          animation: bgShift 30s linear infinite;
        }
        .scanlines {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.05) 1px,
            transparent 2px
          );
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 10;
          mix-blend-mode: screen;
        }
        .shadow-neon {
          text-shadow: 0 0 6px #ff33cc, 0 0 20px #ff33cc;
        }
      `}</style>
    </div>
  );
};

export default GameDetails;