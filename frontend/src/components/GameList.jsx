// frontend/src/components/GameList.jsx
import React from "react";
import GameCard from "./GameCard";

const GameList = ({ games }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {games.map(game => (
      <GameCard key={game.id} game={game} />
    ))}
  </div>
);

export default GameList;