import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "🎮 Welcome to the Neural Gaming Interface. I'm ARIA, your advanced AI gaming companion. Ready to dive into the digital realm?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: "⚡", text: "Action Games", action: "Recommend action games" },
    { icon: "🛡️", text: "RPG Quest", action: "Show RPG games" },
    { icon: "🖥️", text: "System Check", action: "Check PC requirements" },
    { icon: "💎", text: "Budget Finds", action: "Games under $50" },
    { icon: "🏆", text: "Top Rated", action: "Best rated games" },
    { icon: "🚀", text: "New Releases", action: "Latest releases" }
  ];

  useEffect(() => {
    loadGames();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadGames = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/chatbot/games');
      if (response.data.success) {
        setGames(response.data.games || []);
      }
    } catch (error) {
      console.error('Error loading games:', error);
      setGames([
        { id: 1, name: "Cyberpunk 2077", genres: "RPG, Action", price: 39.99, platforms: "PC, PS5", image: "/img/cyberpunk2077.jpg" },
        { id: 2, name: "Spider-Man", genres: "Action, Adventure", price: 59.99, platforms: "PC, PS5", image: "/img/spiderman.jpg" },
        { id: 3, name: "God of War", genres: "Action, RPG", price: 69.99, platforms: "PS5", image: "/img/gow_ragnarok.jpg" },
        { id: 4, name: "Stray", genres: "Adventure, Indie", price: 29.99, platforms: "PC, PS5", image: "/img/stray.jpg" }
      ]);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/chatbot/chat', {
        message: messageText.trim()
      });

      if (response.data.success) {
        setTimeout(() => {
          const botMessage = {
            id: Date.now() + 1,
            role: "bot",
            text: response.data.response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      } else {
        throw new Error(response.data.error || 'Unknown error');
      }
    } catch (err) {
      setError("⚠️ Neural link disrupted. Reconnecting...");
      const errorMessage = {
        id: Date.now() + 1,
        role: "bot",
        text: "❌ Connection interrupted. Please retry your request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: "bot",
        text: "🎮 Neural pathways cleared. Ready for new queries.",
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  return (
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative px-2 sm:px-4 lg:px-16 py-4 gap-4 md:gap-10 pt-20">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 opacity-20 pointer-events-none z-0" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
               linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px'
           }}>
      </div>

      {/* Fixed Navbar */}
      <div className="relative z-50 flex-shrink-0">
        <Navbar />
      </div>

      {/* Main Content - ChatGPT-like layout */}
      <main className="flex-1 relative z-10 pt-20 pb-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
                ARIA NEURAL INTERFACE
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-pink-600 rounded-lg blur opacity-25 animate-tilt"></div>
            </div>
            <p className="text-cyan-300 text-base md:text-lg lg:text-xl font-light tracking-wider">Advanced Gaming Intelligence System</p>
            <div className="flex justify-center items-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-mono">ONLINE</span>
            </div>
          </div>

          {/* Quick Actions Panel - ChatGPT style */}
          <div className="bg-black/30 border border-cyan-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping mr-3"></div>
              <h3 className="text-cyan-300 font-bold text-sm tracking-wider">NEURAL COMMANDS</h3>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {quickActions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(item.action)}
                  className="group bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-lg p-2 hover:border-cyan-400/50 hover:from-cyan-900/20 hover:to-purple-900/20 transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-sm group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                    <span className="text-xs font-bold text-purple-200 group-hover:text-cyan-200 transition-colors text-center leading-tight">{item.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Container - ChatGPT style, main focus */}
          <div className="flex-1 bg-black/20 border border-purple-500/30 rounded-xl backdrop-blur-sm overflow-hidden min-h-[60vh]">
            <div className="h-full p-4 md:p-6">
              <div className="h-full overflow-y-auto space-y-4 scrollbar-custom">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slideIn`}
                  >
                    <div className={`max-w-[85%] ${
                      msg.role === "user" 
                        ? "bg-gradient-to-r from-cyan-600/40 to-purple-600/40 border border-cyan-400/40" 
                        : "bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-400/40"
                    } rounded-2xl p-4 backdrop-blur-sm shadow-lg`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            msg.role === "user" ? "bg-cyan-400" : "bg-purple-400"
                          } animate-pulse`}></div>
                          <span className="text-xs font-bold tracking-wider">
                            {msg.role === "user" ? "USER" : "ARIA"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">
                          {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-100 font-light">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
                
                {(loading || isTyping) && (
                  <div className="flex justify-start animate-slideIn">
                    <div className="bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-400/40 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-purple-300 font-mono">Processing neural patterns...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input Interface - ChatGPT style at bottom */}
          <div className="bg-black/30 border border-cyan-500/30 rounded-xl p-4 mt-4 backdrop-blur-sm">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  rows={3}
                  className="w-full bg-black/50 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 resize-none backdrop-blur-sm text-sm"
                  placeholder="Enter your query into the neural interface..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono">
                  {inputMessage.length}/500
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-bold tracking-wider shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <span>{loading ? "PROCESSING" : "SEND"}</span>
                    <div className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`}></div>
                  </div>
                </button>
                <button
                  onClick={clearChat}
                  disabled={loading}
                  className="bg-red-600/60 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  CLEAR
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm font-mono animate-pulse">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Game Matrix Section - Below main chat interface */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-black/20 border border-pink-500/30 rounded-xl backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping mr-3"></div>
                <h3 className="text-pink-300 font-bold text-xl tracking-wider">GAME MATRIX</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {games.length > 0 ? games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => sendMessage(`Tell me more about ${game.name}`)}
                    className="group bg-black/40 border border-purple-500/20 rounded-lg p-4 cursor-pointer hover:border-cyan-400/50 hover:bg-purple-900/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="space-y-3">
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-800">
                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x128/8b5cf6/ffffff?text=GAME';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-200 text-sm mb-2 group-hover:text-cyan-200 transition-colors line-clamp-2">
                          {game.name}
                        </h4>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full">
                            {game.genres?.split(',')[0] || 'Game'}
                          </span>
                          <span className="text-cyan-400 font-bold text-lg">${game.price}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          📱 {game.platforms}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center text-gray-400 py-8">
                    <div className="animate-pulse">
                      <div className="text-2xl mb-2">⚡</div>
                      <p className="text-sm">Loading game matrix...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Optional Footer */}
      <div className="relative z-50 flex-shrink-0 mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default Chatbot;
