import React from "react";
// ** FIX: We now import the powerful useGameFeeds hook we updated in the last step. **
import { useGameFeeds } from "../../hooks/useGameFeeds";
import GameList from "../../components/Games/GameList";
import Spinner from "../../components/ui/Spinner";
import { FaBroadcastTower } from "react-icons/fa";

const LivePage = () => {
  // ** FIX: We get our live games directly from the central useGameFeeds hook. **
  // This ensures this page uses the same real-time data as the homepage.
  const { games, isLoading } = useGameFeeds();

  const renderContent = () => {
    // ** FIX: The loading logic is now simpler and more robust. **
    // We show a spinner only if the data is loading for the first time.
    if (isLoading && !games.live?.length) {
      return (
        <div className="flex justify-center mt-10">
          <Spinner size="lg" />
        </div>
      );
    }

    // The error handling is now managed by the useApi hook, which shows a toast.

    // ** FIX: We render the game list directly from games.live. **
    if (games.live && games.live.length > 0) {
      return <GameList games={games.live} />;
    }

    // This part for showing "No Live Games" remains the same.
    return (
      <div className="text-center text-gray-500 mt-10 py-16">
        <FaBroadcastTower className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          No Live Games Currently
        </h3>
        <p className="mt-1">Check back soon for in-play action.</p>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live In-Play Matches</h1>
      {renderContent()}
    </div>
  );
};

export default LivePage;
