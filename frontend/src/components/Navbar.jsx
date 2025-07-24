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

import Button from "./Button";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  // Audio & animation state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  
  // Ref elements
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  // Scroll tracking
  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auth context
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Profile dropdown state and ref
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
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

  // Audio toggle
  const toggleAudioIndicator = () => {
    setIsAudioPlaying(prev => !prev);
    setIsIndicatorActive(prev => !prev);
  };

  // Play/pause audio
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  // Navbar show/hide on scroll
  useEffect(() => {
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

  // Animate navbar
  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // Navigation items based on authentication
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

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 bg-black/70 backdrop-blur-md"
      role="banner"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav aria-label="Main navigation" className="flex items-center justify-between p-4">
          {/* Logo and Products Button */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />
            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          {/* Nav links and audio toggle */}
          <div className="flex items-center">
            <div className="hidden md:flex gap-6 items-center">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="nav-hover-btn flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 transition"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Show Profile avatar and dropdown if logged in */}
              {isAuthenticated && (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(prev => !prev)}
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    aria-haspopup="menu"
                    aria-expanded={showProfileMenu}
                    aria-label="User profile menu"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={`${user.username} avatar`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-white" />
                    )}
                    <span className="text-white font-semibold select-none">{user?.username}</span>
                  </button>

                  {showProfileMenu && (
                    <div
                      className="absolute right-0 mt-2 w-44 bg-neutral-900 rounded-lg shadow-lg border border-neutral-800 z-50 animate-fade-in"
                      role="menu"
                    >
                      <div className="px-4 py-3 border-b border-neutral-700">
                        <p className="font-bold text-white truncate">{user?.username}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/profile");
                        }}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-neutral-800 transition"
                        role="menuitem"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-neutral-800 transition"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Audio toggle button */}
            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5 focus:outline-none"
              aria-label="Toggle audio"
            >
              <audio ref={audioElementRef} className="hidden" src="/audio/loop.mp3" loop />
              {[1, 2, 3, 4].map(bar => (
                <div
                  key={bar}
                  className={clsx("indicator-line", { active: isIndicatorActive })}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
