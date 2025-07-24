import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const neonInputClass = "bg-black/80 border border-pink-400 rounded px-4 py-2 w-full text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition";

const Chatbot = () => {
  const [mode, setMode] = useState("recommend"); // “recommend” or “sysreq”
  const [recommendPrompt, setRecommendPrompt] = useState("");
  const [sysSpecs, setSysSpecs] = useState({ cpu: "", gpu: "", ram: "", storage: "" });
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const neonButton = "bg-pink-700 hover:bg-pink-600 text-white py-2 px-6 rounded font-extrabold tracking-wide shadow-md hover:shadow-xl transition";

  const sendQuery = async () => {
    setLoading(true);
    setError(null);

    let prompt = "";
    let endpoint = "";

    if (mode === "recommend") {
      if (!recommendPrompt.trim()) {
        setError("Please enter a game recommendation prompt.");
        setLoading(false);
        return;
      }
      prompt = recommendPrompt.trim();
      endpoint = "/recommend";
    } else {
      const { cpu, gpu, ram, storage } = sysSpecs;
      if (!cpu || !gpu || !ram) {
        setError("Please fill out CPU, GPU, and RAM fields.");
        setLoading(false);
        return;
      }
      prompt = `CPU: ${cpu}, GPU: ${gpu}, RAM: ${ram}GB, Storage: ${storage}`;
      endpoint = "/sysreq";
    }

    try {
      const res = await axios.post(`http://localhost:8080/api/chatbot${endpoint}`, {
        prompt,
      });

      const formattedUserInput = mode === "recommend" ? recommendPrompt.trim() : Object.entries(sysSpecs).map(([key, val]) => `${key.toUpperCase()}: ${val}`).join(", ");

      setChatHistory((prev) => [
        ...prev,
        {
          role: "user",
          text: formattedUserInput,
        },
        {
          role: "bot",
          text: res.data.result,
        },
      ]);

      if (mode === "recommend") setRecommendPrompt("");
      else setSysSpecs({ cpu: "", gpu: "", ram: "", storage: "" });

    } catch (err) {
      setError("🛑 Failed to get response. Please check connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#1b002a] to-[#120042]">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-6 pt-24 pb-10 text-white font-mono">
        <h1 className="text-4xl font-extrabold text-center neon-text-pink mb-6 animate-pulse">🤖 Neon Gamebot</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setMode("recommend")}
            className={`px-4 py-2 rounded-t-md font-bold border-b-4 ${
              mode === "recommend"
                ? "border-pink-500 bg-gradient-to-br from-pink-700 to-pink-600 shadow"
                : "bg-black/50 border-transparent"
            }`}
          >
            🎮 Game Recommendations
          </button>
          <button
            onClick={() => setMode("sysreq")}
            className={`px-4 py-2 rounded-t-md font-bold border-b-4 ${
              mode === "sysreq"
                ? "border-purple-500 bg-gradient-to-br from-purple-700 to-purple-600 shadow"
                : "bg-black/50 border-transparent"
            }`}
          >
            🛠 System Check
          </button>
        </div>

        {/* Input Section */}
        <div className="bg-[#130022]/60 border border-fuchsia-500 rounded-lg p-6 mb-6 shadow-lg backdrop-blur-md">
          {mode === "recommend" ? (
            <textarea
              rows={4}
              className={`resize-none ${neonInputClass}`}
              placeholder="Tell me about your favorite genre, platform, or style... (e.g. 'I like tactical shooters on console')"
              value={recommendPrompt}
              onChange={(e) => setRecommendPrompt(e.target.value)}
            />
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  className={neonInputClass}
                  placeholder="CPU (e.g. Ryzen 5 5600X)"
                  value={sysSpecs.cpu}
                  onChange={(e) => setSysSpecs((s) => ({ ...s, cpu: e.target.value }))}
                />
                <input
                  type="text"
                  className={neonInputClass}
                  placeholder="GPU (e.g. RTX 3060)"
                  value={sysSpecs.gpu}
                  onChange={(e) => setSysSpecs((s) => ({ ...s, gpu: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  className={neonInputClass}
                  placeholder="RAM (GB)"
                  value={sysSpecs.ram}
                  onChange={(e) => setSysSpecs((s) => ({ ...s, ram: e.target.value }))}
                />
                <input
                  type="text"
                  className={neonInputClass}
                  placeholder="Storage (optional)"
                  value={sysSpecs.storage}
                  onChange={(e) => setSysSpecs((s) => ({ ...s, storage: e.target.value }))}
                />
              </div>
            </div>
          )}

          <button
            onClick={sendQuery}
            className={`mt-6 ${neonButton}`}
            disabled={loading}
          >
            {loading ? "Processing..." : "🚀 Ask AI"}
          </button>
          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </div>

        {/* Response section */}
        <div className="bg-black/60 border border-pink-500 rounded-lg p-6 min-h-[200px] max-h-[400px] overflow-y-auto">
          {chatHistory.length === 0 && (
            <p className="text-gray-400 font-light italic text-center">Nothing yet... Ask something above 👆</p>
          )}
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                msg.role === "user"
                  ? "bg-pink-900/50 border-l-4 border-pink-600"
                  : "bg-purple-900/40 border-l-4 border-violet-600"
              }`}
            >
              <strong className="block mb-1 text-sm">
                {msg.role === "user" ? "🧠 YOU" : "🤖 GAMEBOT"}:
              </strong>
              <p className="whitespace-pre-wrap text-sm text-pink-100">{msg.text}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chatbot;
