import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";

import { TiLocationArrow } from "react-icons/ti";
import { AiFillHome } from "react-icons/ai";
import { RiLoginCircleFill } from "react-icons/ri";
import { FaUserPlus, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import ChatbotInterface from "./ChatbotInterface";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  // Removed audio state and refs

  // Refs
  const navContainerRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Scroll control
  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auth
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  // Navbar scroll show/hide logic
  useEffect(() => {
    if (!navContainerRef.current) return;
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  // Animate navbar slide
  useEffect(() => {
    if (!navContainerRef.current) return;
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.3,
      ease: "power1.out",
    });
  }, [isNavVisible]);

  // Navigation items
  const guestNavItems = [
    { label: "Home", icon: <AiFillHome />, path: "/" },
    { label: "Login", icon: <RiLoginCircleFill />, path: "/login" },
    { label: "Register", icon: <FaUserPlus />, path: "/register" },
    { label: "Chatbot", icon: <BsRobot />, path: "/chatbot" },
    { label: "Wishlist", icon: <MdFavorite />, path: "/wishlist" },
    { label: "Cart", icon: <FaShoppingCart />, path: "/cart" },
  ];

  const authNavItems = [
    { label: "Home", icon: <AiFillHome />, path: "/" },
    { label: "Chatbot", icon: <BsRobot />, path: "/chatbot" },
    { label: "Wishlist", icon: <MdFavorite />, path: "/wishlist" },
    { label: "Cart", icon: <FaShoppingCart />, path: "/cart" },
  ];

  const navItems = isAuthenticated ? authNavItems : guestNavItems;

  const scrollToProducts = () => {
    const el = document.getElementById("products-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-50 h-16 border border-pink-900/70 rounded-xl bg-gradient-to-br from-[#2d0232]/85 via-[#1c072e]/85 to-[#0a0519]/80 backdrop-blur-xl shadow-lg transition-all duration-500"
        role="banner"
      >
        <header className="absolute top-1/2 w-full -translate-y-1/2">
          <nav className="flex items-center justify-between px-6 md:px-12">
            {/* Logo + Products button */}
            <div className="flex items-center gap-7">
              <Link to="/" aria-label="Go to Home">
                <img
                  src="/img/logo.png"
                  alt="Avyra logo"
                  className="w-12 fancy-gradient-text drop-shadow-glow"
                />
              </Link>

              <Button
                id="product-button"
                title="Products"
                rightIcon={<TiLocationArrow />}
                containerClass="hidden md:flex items-center justify-center gap-1 bg-blue-600 hover:bg-pink-600 text-black rounded shadow px-3 py-1 text-xs font-bold transition"
                onClick={scrollToProducts}
              />
            </div>

            {/* Navigation & user controls */}
            <div className="flex items-center">
              <div className="hidden md:flex gap-6 items-center">
                {navItems.map(({ label, icon, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className="nav-hover-btn flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-pink-900/50 hover:text-pink-300 text-sm font-semibold uppercase tracking-wider transition duration-200"
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                ))}

                {isAuthenticated && (
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setShowProfileMenu((prev) => !prev)}
                      className="flex items-center gap-2 focus:outline-none rounded hover:ring-2 hover:ring-pink-600 focus:ring-2 focus:ring-pink-400 transition"
                      aria-haspopup="menu"
                      aria-expanded={showProfileMenu}
                      aria-label="User profile menu"
                    >
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={`${user.username} avatar`}
                          className="w-8 h-8 rounded-full object-cover drop-shadow-glow"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-pink-400" />
                      )}
                      <span className="font-semibold select-none text-pink-300">
                        {user?.username}
                      </span>
                    </button>

                    {showProfileMenu && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#491244]/95 to-[#25052a]/90 border border-pink-900 rounded-lg shadow-xl z-50 animate-fade-in p-1"
                        role="menu"
                      >
                        <div className="px-4 py-2 border-b border-pink-700/40">
                          <p className="font-bold text-pink-400 truncate">
                            {user?.username}
                          </p>
                          <p className="text-xs text-pink-500 truncate">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/profile");
                          }}
                          className="block w-full text-left px-4 py-2 text-pink-300 hover:bg-pink-700/40 rounded transition"
                          role="menuitem"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            logout();
                          }}
                          className="block w-full text-left px-4 py-2 text-pink-500 hover:bg-pink-700/40 rounded transition"
                          role="menuitem"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              
            </div>
          </nav>
        </header>
      </div>
    </>
  );
};

export default NavBar;
