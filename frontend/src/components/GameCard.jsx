import { useNavigate } from "react-router-dom";

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => navigate(`/game/${game.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`/game/${game.id}`);
        }
      }}
      className="bg-gradient-to-br from-[#121526] via-[#1c223b] to-[#10141f] rounded-xl shadow-xl shadow-indigo-900/50 p-4 flex flex-col cursor-pointer outline-none
                 hover:scale-[1.03] hover:shadow-pink-600/70 transition-transform duration-300 ease-in-out focus:ring-2 focus:ring-pink-500"
      aria-label={`View details for ${game.title}`}
      title={game.title}
    >
      <img
        src={game.coverUrl}
        alt={`Cover art of ${game.title}`}
        className="h-56 w-full object-cover rounded-xl border-2 border-transparent hover:border-pink-500 transition-all duration-300"
        loading="lazy"
      />

      <h3 className="text-lg sm:text-xl font-extrabold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-fuchsia-500 truncate">
        {game.title}
      </h3>

      {/* Genres as badges */}
      <div className="flex flex-wrap gap-2 mt-2">
        {game.genres?.split(",").map((g) => (
          <span
            key={g.trim()}
            className="inline-block px-2 py-0.5 rounded-lg text-xs font-semibold border border-pink-600 text-pink-300 bg-pink-900/20 select-none"
            title={g.trim()}
          >
            {g.trim()}
          </span>
        ))}
      </div>

      <p
        className="text-gray-400 mt-3 text-sm line-clamp-3 select-text"
        title={game.description}
        aria-label={`Description: ${game.description}`}
      >
        {game.description || "No description available."}
      </p>

      <div className="mt-auto flex justify-between items-center pt-4">
        <span className="text-green-400 font-extrabold text-xl drop-shadow-[0_0_4px_rgba(34,197,94,0.7)]">
          ${game.price?.toFixed(2)}
        </span>
        <button
          onClick={(e) => {
            // Prevent the div click when clicking button
            e.stopPropagation();
            navigate(`/game/${game.id}`);
          }}
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold
                    shadow-lg shadow-indigo-900/60 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          aria-label={`View details of ${game.title}`}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default GameCard;
