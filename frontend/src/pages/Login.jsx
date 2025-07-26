import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

import { Canvas } from '@react-three/fiber'
import { LoginCharacter } from '../components/LoginCharacter'

const Login = () => {
  const navigate = useNavigate()

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        emailOrUsername,
        password,
      })

      const token = response.data.token
      localStorage.setItem('jwtToken', token)

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      navigate('/')
    } catch (err) {
      console.error(err)
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Background gradient and scanlines */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-pink-900 to-blue-900 animate-bgShift -z-10"></div>
      <div className="absolute inset-0 pointer-events-none scanlines"></div>

      {/* Navbar */}
      <NavBar />

      {/* Main content - split layout */}
      <main className="flex flex-1 flex-col md:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 py-10 gap-10">
        {/* Left: Login form */}
        <section
          className="w-full max-w-md
          bg-[#0f0f16] bg-opacity-80 border border-purple-600
          rounded-2xl p-10 shadow-neon flex flex-col
          mt-10 md:mt-24
          ml-0 md:ml-16
          md:self-start"
        >
          <h2 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 mb-8 tracking-widest neon-text">
            LOGIN
          </h2>

          {error && (
            <div className="bg-red-900 bg-opacity-70 border border-red-600 text-red-400 px-4 py-2 rounded mb-6 text-center font-mono tracking-widest glitch-error">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="relative">
              <input
                type="text"
                id="emailOrUsername"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                placeholder="Email or Username"
                className="
                  peer
                  w-full
                  bg-transparent
                  border-b-2
                  border-purple-600
                  text-white
                  placeholder-transparent
                  focus:outline-none
                  focus:border-pink-500
                  transition
                  duration-500
                  pt-6
                "
              />
              <label
                htmlFor="emailOrUsername"
                className="
                  absolute
                  left-0
                  top-1
                  text-purple-400
                  text-sm
                  peer-placeholder-shown:top-6
                  peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-purple-600
                  peer-focus:top-1
                  peer-focus:text-pink-400
                  peer-focus:text-sm
                  cursor-text
                  select-none
                  transition-all
                  duration-300
                "
              >
                Email or Username
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Password"
                className="
                  peer
                  w-full
                  bg-transparent
                  border-b-2
                  border-purple-600
                  text-white
                  placeholder-transparent
                  focus:outline-none
                  focus:border-pink-500
                  transition
                  duration-500
                  pt-6
                "
              />
              <label
                htmlFor="password"
                className="
                  absolute
                  left-0
                  top-1
                  text-purple-400
                  text-sm
                  peer-placeholder-shown:top-6
                  peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-purple-600
                  peer-focus:top-1
                  peer-focus:text-pink-400
                  peer-focus:text-sm
                  cursor-text
                  select-none
                  transition-all
                  duration-300
                "
              >
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3
                rounded
                bg-gradient-to-r
                from-pink-500
                via-purple-600
                to-blue-600
                text-white
                font-extrabold
                text-lg
                tracking-wide
                shadow-neon-button
                hover:from-pink-600 hover:via-purple-700 hover:to-blue-700
                transition-colors
                duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
                uppercase
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-purple-500 tracking-wide font-mono cursor-default select-none text-xs uppercase">
            &copy; 2025 AVYRA. All rights reserved.
          </p>
        </section>

        {/* Right: 3D character inside Canvas */}
        <section
          className="hidden md:flex flex-1 items-center justify-center"
          style={{ minHeight: 500 }}
        >
          <div className="w-full max-w-lg h-full flex items-center justify-center">
            <Canvas
              camera={{ position: [5, 1.2, 4], fov: 50 }} //+back,
              style={{ width: "100%", height: 500, background: "transparent" }}
            >
              {/* Lighting */}
              <ambientLight intensity={0.8} />
              <directionalLight position={[1, 2, 3]} intensity={0.65} />
              {/* 3D Model */}
              <LoginCharacter />
            </Canvas>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Additional styles for scanlines and animations */}
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
            0 0 40px #6a5cff;
        }
        .shadow-neon-button {
          box-shadow:
            0 0 4px #ff7cdf,
            0 0 8px #c832e0,
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
        @keyframes glitch {
          0% {
            text-shadow:
              2px 0 #ff01c1,
              -2px 0 #00ffe7;
          }
          20% {
            text-shadow:
              -2px 0 #ff01c1,
              2px 0 #00ffe7;
          }
          40% {
            text-shadow:
              2px 0 #00ffe7,
              -2px 0 #ff01c1;
          }
          60% {
            text-shadow:
              -2px 0 #00ffe7,
              2px 0 #ff01c1;
          }
          80% {
            text-shadow:
              2px 0 #ff01c1,
              -2px 0 #00ffe7;
          }
          100% {
            text-shadow:
              -2px 0 #ff01c1,
              2px 0 #00ffe7;
          }
        }
      `}</style>
    </div>
  );
}

export default Login
