import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar";

function getFilenameFromGameTitle(title) {
  return title.toLowerCase().replace(/\s+/g, "_") + ".zip";
}

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameTitle = location.state?.gameTitle || "game";
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
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Background gradient similar to the login page but simpler */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-pink-900 to-blue-900 animate-bgShift -z-10"></div>

      {/* Scanlines overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 scanlines"
      ></div>

      {/* Navbar */}
      <NavBar />

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-28 py-24">
        <section className="w-full max-w-md bg-[#0f0f16] bg-opacity-80 border border-pink-600 rounded-2xl p-10 shadow-neon flex flex-col">
          <h1 className="text-center text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 tracking-widest mb-8 select-none neon-text">
            Payment Successful!
          </h1>

          <p className="text-center text-cyan-400 text-lg mb-8 select-none">
            Thank you for your purchase. You can download your game below.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-extrabold text-lg tracking-wide shadow-neon-button hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 transition-colors duration-300 uppercase"
              aria-label={`Download ${gameTitle}`}
            >
              Download {gameTitle}
            </button>

            <button
              onClick={() => navigate("/downloads")}
              className="w-full py-3 rounded border border-pink-600 text-pink-400 font-semibold text-lg tracking-wide hover:bg-pink-700/30 transition-colors duration-300 uppercase"
              aria-label="View my downloads"
            >
              View My Downloads
            </button>
          </div>

          <p className="mt-12 text-center text-purple-500 tracking-wide font-mono cursor-default select-none text-xs uppercase">
            &copy; 2025 AVYRA. All rights reserved.
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Additional styles with Tailwind utilities and minimal custom for animations */}
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

export default SuccessPage;
