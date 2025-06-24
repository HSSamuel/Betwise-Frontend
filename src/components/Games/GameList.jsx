import React from "react";
import GameCard from "./GameCard";
import { FaRegSadTear } from "react-icons/fa"; // Import an icon

const GameList = ({ games, isConnected }) => {
  if (!games || games.length === 0) {
    // FIX: Use a more engaging empty state component
    return (
      <div className="text-center text-gray-500 mt-8 py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <FaRegSadTear className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          No Games Available
        </h3>
        <p className="mt-1">
          Please check back later, as games are synced periodically.
        </p>
      </div>
    );
  }

  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  const validGames = games.filter(
    (game) => game && game._id && mongoIdRegex.test(game._id)
  );

  if (validGames.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No valid games to display.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {validGames.map((game) => (
        <GameCard key={game._id} game={game} isConnected={isConnected} />
      ))}
    </div>
  );
};

export default GameList;
