// frontend/src/components/GameCard.jsx
import React from "react";

const GameCard = ({ game }) => {
  console.log("GameCard coverUrl:", game.coverUrl);
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
      <img src={game.coverUrl} alt={game.title} className="h-48 w-full object-cover rounded" />
      <h3 className="text-xl font-bold mt-2">{game.title}</h3>
      <p className="text-gray-400 text-sm">{game.genres}</p>
      <p className="text-gray-300 mt-1">{game.description?.slice(0, 80)}...</p>
      <div className="mt-auto flex justify-between items-center">
        <span className="text-green-400 font-bold text-lg">${game.price}</span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">View</button>
      </div>
    </div>
  );
};

export default GameCard;