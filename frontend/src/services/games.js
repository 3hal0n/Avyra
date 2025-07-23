// frontend/src/services/games.js
const API_URL = "http://localhost:8080/api/games"; // Adjust if needed

export async function fetchGames({ search = "", genre = "", platform = "", minPrice = "", maxPrice = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (genre) params.append("genre", genre);
  if (platform) params.append("platform", platform);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  const res = await fetch(`${API_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch games");
  return res.json();
}