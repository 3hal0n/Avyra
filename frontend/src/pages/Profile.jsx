import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // For avatar (mock - real upload integration can be added later)
  const [avatar, setAvatar] = useState(null);

  // Cart, Wishlist
  const [cart, setCart] = useState([]);
  const { wishlist, loading: wishlistLoading, refetchWishlist } = useWishlist();

  // Password change fields
  const [pwVisible, setPwVisible] = useState(false);
  const [pwOld, setPwOld] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check login token
  const token = localStorage.getItem("jwtToken");

  // Fetch user/cart data
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Fetch user profile
        const userRes = await axios.get("http://localhost:8080/api/auth/me");
        setUser(userRes.data);

        // Avatar placeholder: null (expand as needed)
        setAvatar(null);

        // Fetch cart top 3 items
        const cartRes = await axios.get("http://localhost:8080/api/cart");
        setCart(cartRes.data);

        // Refresh wishlist context
        refetchWishlist();

        setError(null);
      } catch (err) {
        setError("Failed to load profile. Please login again.");
        localStorage.removeItem("jwtToken");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, refetchWishlist]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // Password change submission handler (stub)
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    // Basic validations
    if (!pwOld || !pwNew || !pwConfirm) {
      setPwError("Please fill out all password fields.");
      return;
    }
    if (pwNew.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwError("Passwords do not match.");
      return;
    }

    try {
      // TODO: Add real API call for password change
      /*
      await axios.post("http://localhost:8080/api/auth/change-password", {
        currentPassword: pwOld,
        newPassword: pwNew
      });
      */
      setPwSuccess("Password changed!");
      setPwOld("");
      setPwNew("");
      setPwConfirm("");
    } catch (err) {
      setPwError(err.response?.data?.error || "Failed to change password.");
    }
  };

  // Render loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading your profile...
      </div>
    );

  // Render error state
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-900 text-white p-4">
        <p>{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-20 bg-gray-800 rounded-xl shadow-2xl p-8 text-white min-h-[70vh]">
        <div className="flex gap-8 items-center mb-8">
          {/* Avatar */}
          <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-fuchsia-700 rounded-full flex justify-center items-center text-4xl font-bold shadow-md border-4 border-white/20">
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              user.username?.slice(0, 2).toUpperCase() || "U"
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            <p className="text-gray-300">
              Joined:{" "}
              <span className="font-semibold">
                {user.registeredAt &&
                  new Date(user.registeredAt).toLocaleDateString()}
              </span>
            </p>
            <p className="text-gray-300">
              Email: <span className="font-semibold">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Change password */}
        <div className="mb-5 border border-white/10 rounded-lg bg-gray-900/50 p-5 shadow">
          <h2
            onClick={() => setPwVisible((v) => !v)}
            className="text-xl font-semibold mb-2 cursor-pointer flex items-center select-none"
          >
            Change Password
            <span className="ml-3 text-sm text-indigo-400 hover:underline">
              {pwVisible ? "Hide" : "Show"}
            </span>
          </h2>
          {pwVisible && (
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  value={pwOld}
                  onChange={(e) => setPwOld(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {pwError && <div className="text-red-400">{pwError}</div>}
              {pwSuccess && <div className="text-green-400">{pwSuccess}</div>}
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded mt-1 font-bold text-white">
                Change Password
              </button>
            </form>
          )}
        </div>

        {/* ASSOCIATED RESOURCES SUMMARY */}
        <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Wishlist Preview */}
          <div className="bg-[#252043] border border-white/10 rounded-lg p-4 shadow flex-1">
            <h3 className="text-lg font-semibold mb-2 flex justify-between">
              Wishlist{" "}
              <Link to="/wishlist" className="text-indigo-400 text-sm hover:underline">
                View All
              </Link>
            </h3>
            {wishlistLoading ? (
              <div>Loading...</div>
            ) : wishlist && wishlist.length > 0 ? (
              <ul className="space-y-1">
                {wishlist.slice(0, 3).map((item) => (
                  <li key={item.gameId} className="truncate">
                    {item.title}
                  </li>
                ))}
                {wishlist.length > 3 && (
                  <li className="text-gray-400 text-xs">
                    ...and {wishlist.length - 3} more
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm">No items yet.</div>
            )}
          </div>
          {/* Cart Preview */}
          <div className="bg-[#222d43] border border-white/10 rounded-lg p-4 shadow flex-1">
            <h3 className="text-lg font-semibold mb-2 flex justify-between">
              Cart{" "}
              <Link to="/cart" className="text-indigo-400 text-sm hover:underline">
                View All
              </Link>
            </h3>
            {cart && cart.length > 0 ? (
              <ul className="space-y-1">
                {cart.slice(0, 3).map((item) => (
                  <li key={item.gameId} className="truncate">
                    {item.title}{" "}
                    <span className="text-xs text-gray-300">x{item.quantity}</span>
                  </li>
                ))}
                {cart.length > 3 && (
                  <li className="text-gray-400 text-xs">
                    ...and {cart.length - 3} more
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm">No items in cart.</div>
            )}
          </div>
        </div>

        {/* Orders Preview */}
        <div className="bg-[#1a2336] border border-white/10 rounded-lg p-4 shadow mt-6">
          <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
            Orders{" "}
            <Link to="/orders" className="text-indigo-400 text-sm hover:underline">
              View All
            </Link>
          </h3>
          {/* Replacing "Coming soon..." with a button link */}
          <div>
            <Link
              to="/orders"
              className="inline-block mt-2 px-5 py-2 bg-indigo-600 rounded hover:bg-indigo-700 font-semibold text-white"
            >
              Go to Orders
            </Link>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 py-2 rounded font-bold text-white shadow-lg"
        >
          Logout
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
