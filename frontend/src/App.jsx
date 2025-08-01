import { Routes, Route } from "react-router-dom";
// Pages
import Home from "./pages/Home";
import GameDetails from "./pages/GameDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";
import Downloads from "./pages/Downloads";
import DownloadDetails from "./pages/DownloadDetails";
import SuccessPage from "./pages/SuccessPage";
import ChatbotInterface from "./components/ChatbotInterface";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<GameDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/downloads/:id" element={<DownloadDetails />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/chatbot-interface" element={<ChatbotInterface />} />
      {/* Optional future pages */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
