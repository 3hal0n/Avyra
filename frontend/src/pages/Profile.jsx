import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { wishlist, loading: wishlistLoading } = useWishlist();

  // Password change fields
  const [pwOld, setPwOld] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        const userRes = await axios.get("http://localhost:8080/api/auth/me");
        setUser(userRes.data);
        setAvatar(null);
        
        const cartRes = await axios.get("http://localhost:8080/api/cart");
        setCart(cartRes.data);
        
        setError(null);
      } catch (err) {
        setError("Failed to load account data. Please login again.");
        localStorage.removeItem("jwtToken");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

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
      setPwSuccess("Password updated successfully!");
      setPwOld("");
      setPwNew("");
      setPwConfirm("");
      
      setTimeout(() => {
        setPwError(null);
        setPwSuccess(null);
      }, 3000);
    } catch (err) {
      setPwError(err.response?.data?.error || "Failed to change password.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <div className="neon-flicker text-xl">Loading account...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white p-4">
        <div className="error-neon max-w-xl mx-auto">
          <p>{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="btn-neon mt-6 px-6 py-3 w-full rounded font-mono tracking-wide text-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );

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
        .glassmorphic-bg {
          background: rgba(15, 15, 25, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(0, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 255, 255, 0.1);
        }
        .glassmorphic-card {
          background: rgba(10, 10, 20, 0.6);
          border-radius: 16px;
          border: 1px solid rgba(0, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .glassmorphic-card:hover {
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 255, 255, 0.1);
        }
        .btn-neon {
          color: #0ff;
          border: 1px solid #0ff;
          box-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
          background: transparent;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .btn-neon:hover:not(:disabled) {
          color: #f0f;
          border-color: #f0f;
          box-shadow: 0 0 12px rgba(255, 0, 255, 0.4);
          transform: translateY(-1px);
        }
        .btn-danger {
          color: #f44;
          border: 1px solid #f44;
          box-shadow: 0 0 8px rgba(255, 68, 68, 0.3);
          background: transparent;
          transition: all 0.3s ease;
        }
        .btn-danger:hover {
          color: #f66;
          border-color: #f66;
          box-shadow: 0 0 12px rgba(255, 102, 102, 0.4);
          transform: translateY(-1px);
        }
        .input-neon {
          background-color: rgba(5, 5, 15, 0.8);
          border: 1px solid rgba(0, 255, 255, 0.3);
          color: #0ff;
          border-radius: 8px;
          padding: 0.75rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }
        .input-neon:focus {
          outline: none;
          border-color: #f0f;
          box-shadow: 0 0 8px rgba(255, 0, 255, 0.3);
          color: #f0f;
        }
        .avatar-glow {
          box-shadow: 0 0 24px rgba(0, 255, 255, 0.6);
          border: 2px solid #0ff;
          animation: pulse-glow 3s infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 24px rgba(0, 255, 255, 0.6);
          }
          50% {
            box-shadow: 0 0 32px rgba(255, 0, 255, 0.6);
          }
        }
        .error-neon {
          border: 1px solid #f44;
          background: rgba(255, 68, 68, 0.1);
          box-shadow: 0 0 8px rgba(255, 68, 68, 0.2);
          color: #f44;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
        }
        .success-neon {
          border: 1px solid #4f4;
          background: rgba(68, 255, 68, 0.1);
          box-shadow: 0 0 8px rgba(68, 255, 68, 0.2);
          color: #4f4;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
        }
        .tab-button {
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .tab-button.active {
          color: #0ff;
          border-bottom-color: #0ff;
          box-shadow: 0 4px 8px rgba(0, 255, 255, 0.2);
        }
        .tab-button:hover:not(.active) {
          color: rgba(255, 255, 255, 0.8);
        }
        .stat-compact {
          text-align: center;
          padding: 1rem;
          border-radius: 12px;
          background: rgba(0, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .stat-compact:hover {
          background: rgba(0, 255, 255, 0.1);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="flex flex-col h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
        <Navbar />
        
        <main className="flex-1 w-full overflow-y-auto pt-20">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="glassmorphic-bg p-8">
              {/* User Header - Simplified */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="avatar-glow w-24 h-24 rounded-full flex justify-center items-center text-3xl font-bold select-none">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-cyan-400">
                      {user?.username?.slice(0, 2).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold mb-2 text-cyan-400">
                    {user?.username}
                  </h1>
                  <p className="text-gray-400 mb-1">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {user?.registeredAt && new Date(user.registeredAt).toLocaleDateString()}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="btn-danger px-6 py-2 text-sm"
                >
                  Logout
                </button>
              </div>

              {/* Quick Stats - Horizontal Layout */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="stat-compact">
                  <div className="text-2xl font-bold text-pink-400 mb-1">
                    {wishlist?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Wishlist</div>
                </div>
                <div className="stat-compact">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {cart?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Cart</div>
                </div>
                <div className="stat-compact">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    Active
                  </div>
                  <div className="text-xs text-gray-400">Status</div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`tab-button ${activeTab === "security" ? "active" : ""}`}
                  onClick={() => setActiveTab("security")}
                >
                  Security
                </button>
                <button
                  className={`tab-button ${activeTab === "library" ? "active" : ""}`}
                  onClick={() => setActiveTab("library")}
                >
                  Library
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="glassmorphic-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link to="/wishlist" className="btn-neon text-center py-3">
                        💖 View Wishlist ({wishlist?.length || 0})
                      </Link>
                      <Link to="/cart" className="btn-neon text-center py-3">
                        🛒 View Cart ({cart?.length || 0})
                      </Link>
                      <Link to="/downloads" className="btn-neon text-center py-3">
                        📦 Download History
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="glassmorphic-card p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-cyan-400">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="input-neon w-full"
                          value={pwOld}
                          onChange={(e) => setPwOld(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-cyan-400">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="input-neon w-full"
                          value={pwNew}
                          onChange={(e) => setPwNew(e.target.value)}
                          minLength={8}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-cyan-400">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="input-neon w-full"
                          value={pwConfirm}
                          onChange={(e) => setPwConfirm(e.target.value)}
                          minLength={8}
                          required
                        />
                      </div>
                    </div>
                    
                    {pwError && <div className="error-neon">{pwError}</div>}
                    {pwSuccess && <div className="success-neon">{pwSuccess}</div>}
                    
                    <button type="submit" className="btn-neon px-8 py-2">
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "library" && (
                <div className="space-y-6">
                  {/* Recent Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glassmorphic-card p-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-pink-400">Recent Wishlist</h3>
                        <Link to="/wishlist" className="text-xs text-cyan-400 hover:underline">
                          View All
                        </Link>
                      </div>
                      {wishlistLoading ? (
                        <div className="text-cyan-400 text-sm">Loading...</div>
                      ) : wishlist && Array.isArray(wishlist) && wishlist.length > 0 ? (
                        <ul className="space-y-1.5">
                          {wishlist.slice(0, 3).map((item) => (
                            <li key={item.gameId} className="text-sm text-gray-300 truncate">
                              • {item.title}
                            </li>
                          ))}
                          {wishlist.length > 3 && (
                            <li className="text-xs text-gray-500 italic">
                              +{wishlist.length - 3} more...
                            </li>
                          )}
                        </ul>
                      ) : (
                        <div className="text-gray-500 text-sm">No items yet</div>
                      )}
                    </div>

                    <div className="glassmorphic-card p-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-cyan-400">Cart Items</h3>
                        <Link to="/cart" className="text-xs text-cyan-400 hover:underline">
                          View All
                        </Link>
                      </div>
                      {cart && Array.isArray(cart) && cart.length > 0 ? (
                        <ul className="space-y-1.5">
                          {cart.slice(0, 3).map((item) => (
                            <li key={item.gameId} className="text-sm text-gray-300 truncate">
                              • {item.title} <span className="text-xs text-purple-400">×{item.quantity}</span>
                            </li>
                          ))}
                          {cart.length > 3 && (
                            <li className="text-xs text-gray-500 italic">
                              +{cart.length - 3} more...
                            </li>
                          )}
                        </ul>
                      ) : (
                        <div className="text-gray-500 text-sm">No items in cart</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Profile;
