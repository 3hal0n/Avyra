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
    <div className="min-h-screen bg-gradient-to-br from-[#12001b] to-[#141a33] text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-6">My Downloads 📥</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : downloads.length === 0 ? (
          <p className="text-gray-400">You have no downloads yet.</p>
        ) : (
          <div className="space-y-6">
            {downloads.map((order) => (
              <div
                key={order.id || order.orderId}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">
                    <Link
                      to={`/downloads/${order.id || order.orderId}`}
                      className="text-pink-400 underline"
                    >
                      Download Order #{order.id || order.orderId}
                    </Link>
                  </h3>
                  <span className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <ul className="pl-5 list-disc space-y-1">
                  {(order.items || order.downloads || []).map((item, idx) => {
                    // item may be string title or object with game.title, adjust accordingly
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
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
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
      </main>
      <Footer />
    </div>
  );
};

export default Downloads;
