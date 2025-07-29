import React from "react";
import { useLocation } from "react-router-dom";

function getFilenameFromGameTitle(title) {
  return title.toLowerCase().replace(/\s+/g, "_") + ".zip";
}

const SuccessPage = () => {
  const location = useLocation();
  const gameTitle = location.state?.gameTitle || "game"; // fallback
  const filename = getFilenameFromGameTitle(gameTitle);
  const token = localStorage.getItem("jwtToken");

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/downloads/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-6">Thank you for your purchase. You can download your game below.</p>
      <button
        onClick={handleDownload}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Download {gameTitle}
      </button>
    </div>
  );
};

export default SuccessPage;
