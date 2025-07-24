import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

      // Optionally redirect after some delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (
        err.response &&
        err.response.data &&
        typeof err.response.data === "string"
      ) {
        setError(err.response.data);
      } else {
        setError("Registration failed. Please check your info.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-md shadow-md text-white mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && (
        <div className="bg-red-600 p-2 mb-4 rounded text-center">{error}</div>
      )}
      {successMsg && (
        <div className="bg-green-600 p-2 mb-4 rounded text-center">{successMsg}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded text-black"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="username" className="block mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={100}
            className="w-full p-2 rounded text-black"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">
            Password (min 8 characters)
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full p-2 rounded text-black"
            placeholder="Set your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-bold"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
