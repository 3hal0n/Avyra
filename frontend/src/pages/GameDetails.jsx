import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";

const StarRating = ({ value = 5 }) => (
  <span className="text-yellow-400 text-lg">{'★'.repeat(value).padEnd(5, '☆')}</span>
);

const isLoggedIn = () => !!localStorage.getItem("jwtToken");

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const { 
    wishlist, loading: wishlistLoading, feedback: wishlistFeedback,
    addToWishlist, removeFromWishlist, isInWishlist 
  } = useWishlist();

  const [reviews, setReviews] = useState([
    { username: "Alex", comment: "Amazing game!", stars: 5, avatar: "" },
    { username: "Chris", comment: "Engaging story and visuals.", stars: 4, avatar: "" }
  ]);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState(null);
  const [feedback, setFeedback] = useState({ cart: null, review: null });
  const [addingCart, setAddingCart] = useState(false);

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

  // Cart add handler
  const handleAddCart = async () => {
    if (!isLoggedIn()) return navigate("/login");
    setAddingCart(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("jwtToken")}`;
      await axios.post(`http://localhost:8080/api/cart/${game.id}?quantity=1`);
      setFeedback(f => ({ ...f, cart: "Added to cart!" }));
    } catch (err) {
      setFeedback(f => ({ ...f, cart: "Failed to add to cart." }));
    }
    setTimeout(() => setFeedback(f => ({ ...f, cart: null })), 2000);
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

  // Review submit handler
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      setReviewError("Login to submit a review.");
      return;
    }
    if (!reviewText.trim()) {
      setReviewError("Enter your review.");
      return;
    }
    setReviews([
      { username: "You", comment: reviewText, stars: 5, avatar: "" },
      ...reviews
    ]);
    setReviewText("");
    setReviewError(null);
    setFeedback(f => ({ ...f, review: "Thank you for reviewing!" }));
    setTimeout(() => setFeedback(f => ({ ...f, review: null })), 2000);
  };

  if (loading)
    return <div className="flex items-center justify-center min-h-screen bg-black text-white text-2xl">Loading...</div>;

  if (!game || Object.keys(game).length === 0)
    return <div className="flex items-center justify-center min-h-screen bg-black text-red-500 text-2xl">Game not found.</div>;

  const wishlistActive = isInWishlist(game.id);

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
              <h1 className="text-4xl tracking-tight font-bold text-white drop-shadow">{game.title}</h1>
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
                className={`px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-all shadow ${addingCart ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={addingCart}
              >
                {feedback.cart ? feedback.cart : addingCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`px-5 py-2 rounded-lg font-semibold text-white transition-all shadow ${wishlistActive ? 'bg-pink-500 hover:bg-pink-600' : 'bg-pink-600 hover:bg-pink-700'
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
                {game.sysreqMin && (<div><span className="font-medium">Min:</span> {game.sysreqMin}</div>)}
                {game.sysreqRec && (<div><span className="font-medium">Recommended:</span> {game.sysreqRec}</div>)}
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
            {isLoggedIn() && (
              <form
                onSubmit={handleReviewSubmit}
                className="flex flex-col md:flex-row items-end gap-3"
                autoComplete="off"
              >
                <textarea
                  className="resize-none rounded bg-gray-800 border border-white/30 text-white px-3 py-1 min-w-[200px] min-h-[36px]"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  maxLength={300}
                  required
                  rows={2}
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg font-bold text-white"
                >
                  Post Review
                </button>
              </form>
            )}
          </div>
          {reviewError && <div className="text-red-400 mb-3">{reviewError}</div>}
          {feedback.review && <div className="text-green-400 mb-3">{feedback.review}</div>}
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="text-gray-300 text-center py-6">No reviews yet. Be the first!</div>
            )}
            {reviews.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center text-white font-bold text-lg select-none">
                  {r.avatar ? <img src={r.avatar} alt={r.username} className="rounded-full w-full h-full object-cover" /> : r.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{r.username}</span>
                    <StarRating value={r.stars} />
                  </div>
                  <div className="text-gray-200">{r.comment}</div>
                </div>
              </div>
            ))}
          </div>
          {!isLoggedIn() && (
            <div className="mt-4 text-gray-400 text-center">
              <button className="underline text-blue-400" onClick={() => navigate("/login")}>
                Login
              </button>
              to post a review.
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default GameDetails;
