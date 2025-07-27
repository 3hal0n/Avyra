import React from 'react';
import { Gamepad2, DollarSign, Monitor } from 'lucide-react';

const GameSidebar = ({ games, onGameClick }) => {
  return (
    <div className="w-80 bg-white/90 backdrop-blur-sm p-6 border-l border-gray-200 overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Gamepad2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Featured Games</h2>
      </div>
      
      <div className="space-y-4">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onGameClick(`Tell me more about ${game.name}`)}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 border border-gray-100"
          >
            <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Game+Image';
                }}
              />
            </div>
            
            <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
              {game.name}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {game.genres?.split(',')[0] || 'Game'}
              </span>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span className="font-semibold text-blue-600">{game.price}</span>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <Monitor className="w-3 h-3 mr-1" />
              <span className="truncate">{game.platforms}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSidebar;
