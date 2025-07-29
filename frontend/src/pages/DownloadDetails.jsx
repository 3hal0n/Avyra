import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { downloadFile } from "../utils/downloadFile";

function getFilenameFromGameTitle(title) {
  return title.toLowerCase().replace(/\s+/g, "_") + ".zip";
}

/**
 * Props:
 *  - downloads: array of order/download objects with { orderId, items }
 */
const DownloadDetails = ({ downloads }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const order = downloads.find((o) => (o.orderId || o.id) === orderId);

  if (!order) {
    return <div className="p-6">Download order not found.</div>;
  }

  const handleDownload = async (filename) => {
    try {
      await downloadFile(filename, token);
    } catch (error) {
      alert(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#160020] to-[#080015] text-white">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">Download Details: {order.orderId || order.id}</h1>
        <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 shadow-xl">
          <p className="mb-2 text-sm text-gray-400">
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </p>
          <ul className="space-y-2 mb-4">
            {(order.items || order.downloads || []).map((item, i) => {
              const title =
                typeof item === "string"
                  ? item
                  : item.game?.title || item.title || "Game";

              const filename = getFilenameFromGameTitle(title);

              return (
                <li
                  key={item.id?.gameId || item.game?.id || i}
                  className="flex justify-between border-b border-gray-700 pb-2"
                >
                  <span>{title}</span>
                  <button
                    onClick={() => handleDownload(filename)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    aria-label={`Download ${title}`}
                  >
                    Download
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => navigate("/downloads")}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            🔙 Back to Downloads
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadDetails;
