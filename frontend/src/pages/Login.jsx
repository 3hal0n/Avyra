import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        emailOrUsername,
        password,
      });

      const token = response.data.token;
      // Save JWT token to localStorage (or context/store if you have one)
      localStorage.setItem("jwtToken", token);

      // Optionally set default auth header globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect to home page or intended URL
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-md shadow-md text-white mt-10">
      <NavBar />
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && (
        <div className="bg-red-600 p-2 mb-4 rounded text-center">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="emailOrUsername" className="block mb-1">
            Email or Username
          </label>
          <input
            type="text"
            id="emailOrUsername"
            value={emailOrUsername}
            onChange={e => setEmailOrUsername(e.target.value)}
            required
            className="w-full p-2 rounded text-black"
            placeholder="Enter your email or username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full p-2 rounded text-black"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
