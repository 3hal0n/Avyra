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
    <>
      <style>{`
        .cyber-bg {
          background: linear-gradient(90deg, #0ff 1px, transparent 1px),
                      linear-gradient(#0ff 1px, transparent 1px);
          background-size: 30px 30px;
          animation: gridMove 10s linear infinite;
        }
        @keyframes gridMove {
          from { background-position: 0 0, 0 0; }
          to { background-position: 30px 30px, 30px 30px; }
        }
        .neon-text {
          color: #0ff;
          text-shadow:
            0 0 5px #0ff,
            0 0 10px #0ff,
            0 0 20px #0ff,
            0 0 40px #0ff;
        }
        .neon-btn {
          background: linear-gradient(45deg, #00f6ff, #6effff);
          border-radius: 12px;
          padding: 0.75rem 2rem;
          font-weight: 700;
          color: #001f27;
          box-shadow:
            0 0 5px #00f6ff,
            0 0 15px #6effff,
            0 0 20px #00f6ff,
            inset 0 0 5px #6effff;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          user-select: none;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin: 0.5rem;
        }
        .neon-btn:hover {
          box-shadow:
            0 0 10px #00ffff,
            0 0 30px #00ffff,
            0 0 40px #00ffff,
            inset 0 0 10px #00ffff;
          color: #000a0f;
          transform: scale(1.05);
        }
        .neon-container {
          background: rgba(0, 15, 23, 0.85);
          border-radius: 16px;
          padding: 2.5rem 2rem;
          max-width: 480px;
          margin: 3rem auto;
          box-shadow:
            0 0 10px #00f6ffaa,
            inset 0 0 15px #0ff6ffaa;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .flicker {
          animation: flickerAnimation 3s infinite;
        }
        @keyframes flickerAnimation {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 22%, 24%, 55% { opacity: 0.6; }
        }
      `}</style>

      <div className="min-h-screen cyber-bg flex flex-col">
        <NavBar />

        <main className="flex-grow flex items-center justify-center px-4">
          <div className="neon-container text-center">
            <h1 className="text-4xl font-extrabold neon-text select-none mb-4">
              Payment Successful!
            </h1>
            <p className="text-cyan-300 text-lg flicker mb-8 select-none">
              Thank you for your purchase. You can download your game below.
            </p>

            <div>
              <button onClick={handleDownload} className="neon-btn">
                Download {gameTitle}
              </button>

              <button
                onClick={() => navigate("/downloads")}
                className="neon-btn"
                aria-label="View my downloads"
              >
                View My Downloads
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SuccessPage;
