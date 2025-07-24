// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// //Pages
// import Home from "./pages/Home";
// import GameDetails from "./pages/GameDetails";
// import Cart from "./pages/Cart";
// import Wishlist from "./pages/Wishlist";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// // import NotFound from "./pages/NotFound";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/game/:id" element={<GameDetails />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/wishlist" element={<Wishlist />} />
//         {/* Optional future pages */}
//         {/* 
        
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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
// import NotFound from "./pages/NotFound";

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
      {/* Optional future pages */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
