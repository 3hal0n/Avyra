import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { downloadFile } from "../utils/downloadFile";

function getFilenameFromGameTitle(title) {
  return title.toLowerCase().replace(/\s+/g, "_") + ".zip";
}

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setAuthHeader = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  };

  const fetchDownloads = async () => {
    try {
      if (!setAuthHeader()) throw new Error("Not authenticated");
      const res = await axios.get("http://localhost:8080/api/orders");
      const data = res.data;

      if (Array.isArray(data)) {
        setDownloads(data);
      } else if (data && typeof data === "object") {
        setDownloads(data.orders || []);
      } else {
        setDownloads([]);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch your downloads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const token = localStorage.getItem("jwtToken");

  const handleDownload = async (filename) => {
    try {
      await downloadFile(filename, token);
    } catch (error) {
      alert(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden text-white">
      {/* Background gradient and scanlines like login page */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-pink-900 to-blue-900 animate-bgShift -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 scanlines"
      />

      {/* Navbar */}
      <Navbar />

      {/* Main container */}
      <main className="flex-1 max-w-5xl mx-auto px-6 pt-24 pb-10">
        <section className="bg-[#0f0f16] bg-opacity-80 border border-pink-600 rounded-2xl p-8 shadow-neon">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 tracking-widest mb-8 select-none neon-text">
            My Downloads 📥
          </h1>

          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          ) : downloads.length === 0 ? (
            <p className="text-center text-gray-400">You have no downloads yet.</p>
          ) : (
            <div className="space-y-6">
              {downloads.map((order) => (
                <div
                  key={order.id || order.orderId}
                  className="bg-gray-900 bg-opacity-40 p-4 rounded-lg border border-pink-700"
                >
                  <div className="flex justify-between mb-3">
                    <h3 className="font-bold text-pink-400">
                      <Link
                        to={`/downloads/${order.id || order.orderId}`}
                        className="underline hover:text-pink-300 transition"
                      >
                        Download Order #{order.id || order.orderId}
                      </Link>
                    </h3>
                    <span className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <ul className="pl-5 list-disc space-y-2">
                    {(order.items || order.downloads || []).map((item, idx) => {
                      const title =
                        typeof item === "string"
                          ? item
                          : item.game?.title || item.title || "Game";

                      const filename = getFilenameFromGameTitle(title);

                      return (
                        <li
                          key={item.id?.gameId || item.game?.id || idx}
                          className="flex justify-between items-center"
                        >
                          <span>{title}</span>
                          <button
                            onClick={() => handleDownload(filename)}
                            className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white px-4 py-1 rounded text-sm font-semibold uppercase tracking-wide shadow-neon-button transition"
                            aria-label={`Download ${title}`}
                          >
                            Download
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Additional styles and animations */}
      <style>{`
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bgShift {
          background-size: 200% 200%;
          animation: bgShift 15s ease infinite;
        }
        .scanlines {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.05),
            rgba(255,255,255,0.05) 1px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: screen;
        }
        .shadow-neon {
          box-shadow:
            0 0 8px #c331d7,
            0 0 16px #9a2cca,
            0 0 24px #682e99;
        }
        .shadow-neon-button {
          box-shadow:
            0 0 6px #ff79e1,
            0 0 14px #c35ce0,
            0 0 20px #9a3fc7;
        }
        .neon-text {
          text-shadow:
            0 0 5px #ff2dad,
            0 0 10px #b01db0,
            0 0 20px #720c6d;
        }
      `}</style>
    </div>
  );
};

export default Downloads;
