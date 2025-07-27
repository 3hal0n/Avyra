import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Canvas } from '@react-three/fiber';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { RegisterCharacter } from "../components/RegisterCharacter";
import { LoginCharacter } from "../components/LoginCharacter";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        email,
        username,
        password,
      });

      setSuccessMsg("Registration successful! You can now log in.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (typeof err.response?.data === "string") {
        setError(err.response.data);
      } else {
        setError("Registration failed. Please check your info.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden">
      <NavBar />

      {/* Background gradient and scanlines */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-pink-900 to-black animate-bgShift -z-10"></div>
      <div className="absolute inset-0 pointer-events-none scanlines"></div>

      <main className="flex flex-1 flex-col md:flex-row items-center justify-center px-4 sm:px-8 lg:px-28 py-10 gap-10">
        {/* Left: Register Form */}
        <section className="w-full max-w-md bg-[#0f0f16] bg-opacity-80 border border-pink-600 rounded-2xl p-10 shadow-neon flex flex-col mt-12 md:mt-24 ml-2 md:ml-10 md:self-start">
          <h2 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500 mb-8 tracking-widest neon-text">
            REGISTER
          </h2>

          {error && (
            <div className="bg-red-900 bg-opacity-70 border border-red-600 text-red-400 px-4 py-2 rounded mb-6 text-center font-mono tracking-widest glitch-error">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-pink-900 bg-opacity-80 border border-pink-500 text-pink-300 px-4 py-2 rounded mb-6 text-center font-mono tracking-wider glitch-success">
              {successMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="
                  peer w-full bg-transparent border-b-2 border-pink-400
                  text-white placeholder-transparent focus:outline-none
                  focus:border-fuchsia-400 transition duration-500 pt-6
                "
              />
              <label htmlFor="email"
                className="
                  absolute left-0 top-1 text-pink-400 text-sm
                  peer-placeholder-shown:top-6 peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-fuchsia-500 peer-focus:top-1
                  peer-focus:text-fuchsia-400 peer-focus:text-sm cursor-text
                  select-none transition-all duration-300
                "
              >Email</label>
            </div>
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required minLength={3} maxLength={100}
                placeholder="Username"
                className="
                  peer w-full bg-transparent border-b-2 border-pink-400
                  text-white placeholder-transparent focus:outline-none
                  focus:border-fuchsia-400 transition duration-500 pt-6
                "
              />
              <label htmlFor="username"
                className="
                  absolute left-0 top-1 text-pink-400 text-sm
                  peer-placeholder-shown:top-6 peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-fuchsia-500 peer-focus:top-1
                  peer-focus:text-fuchsia-400 peer-focus:text-sm
                  cursor-text select-none transition-all duration-300
                "
              >Username</label>
            </div>
            {/* Password */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required minLength={8}
                placeholder="Password"
                className="
                  peer w-full bg-transparent border-b-2 border-pink-400
                  text-white placeholder-transparent focus:outline-none
                  focus:border-fuchsia-400 transition duration-500 pt-6
                "
              />
              <label htmlFor="password"
                className="
                  absolute left-0 top-1 text-pink-400 text-sm
                  peer-placeholder-shown:top-6 peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-fuchsia-500 peer-focus:top-1
                  peer-focus:text-fuchsia-400 peer-focus:text-sm
                  cursor-text select-none transition-all duration-300
                "
              >Password (min 8 characters)</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600
                text-white font-extrabold text-lg tracking-wide shadow-neon-button
                hover:from-fuchsia-700 hover:via-purple-700 hover:to-pink-700
                transition-colors duration-300 disabled:opacity-50
                disabled:cursor-not-allowed uppercase
              "
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-pink-400 tracking-wide font-mono cursor-default select-none text-xs uppercase">
            &copy; 2025 AVYRA. All rights reserved.
          </p>
        </section>

        {/* Right: Spiderman 3D Model in Canvas */}
        <section className="hidden md:flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg h-full flex items-center justify-center">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ width: '100%', height: 500 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[1, 2, 3]} intensity={0.65} />
              {/* <RegisterCharacter /> */}
              <LoginCharacter />
            </Canvas>
          </div>
        </section>
      </main>
      <Footer />
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
            0 0 5px #e60073,
            0 0 10px #e60073,
            0 0 20px #d74bff,
            0 0 30px #d74bff,
            0 0 40px #a02fff;
        }
        .shadow-neon-button {
          box-shadow:
            0 0 4px #ff7cdf,
            0 0 8px #a02fff,
            0 0 16px #9b2ecf;
        }
        .neon-text {
          text-shadow:
            0 0 3px #ff2987,
            0 0 7px #a902e1,
            0 0 14px #6737f8;
        }
        .glitch-error {
          animation: glitch 1.5s infinite;
        }
        .glitch-success {
          animation: glitchsuccess 1.5s infinite;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 #ff01c1, -2px 0 #00ffe7; }
          20% { text-shadow: -2px 0 #ff01c1, 2px 0 #00ffe7; }
          40% { text-shadow: 2px 0 #00ffe7, -2px 0 #ff01c1; }
          60% { text-shadow: -2px 0 #00ffe7, 2px 0 #ff01c1; }
          80% { text-shadow: 2px 0 #ff01c1, -2px 0 #00ffe7; }
          100% { text-shadow: -2px 0 #ff01c1, 2px 0 #00ffe7; }
        }
        @keyframes glitchsuccess {
          0% { text-shadow: 2px 0 #fc67cb, -2px 0 #d569fc; }
          20% { text-shadow: -2px 0 #fc67cb, 2px 0 #d569fc; }
          40% { text-shadow: 2px 0 #d569fc, -2px 0 #fc67cb; }
          60% { text-shadow: -2px 0 #d569fc, 2px 0 #fc67cb; }
          80% { text-shadow: 2px 0 #fc67cb, -2px 0 #d569fc; }
          100% { text-shadow: -2px 0 #fc67cb, 2px 0 #d569fc; }
        }
      `}</style>
    </div>
  );
};

export default Register;
