import React, { useState, useMemo, useRef } from "react";
import { useGameFeeds } from "../../hooks/useGameFeeds";
import GameList from "../../components/Games/GameList";
import BetSlip from "../../components/bets/BetSlip";
import GameCardSkeleton from "../../components/Games/GameCardSkeleton";
import { useAuth } from "../../contexts/AuthContext";
import WorldSportsNews from "../../components/news/WorldSportsNews";
import Button from "../../components/ui/Button";
import OddsDisplay from "../../components/Games/OddsDisplay";
import {
  FaRegSadTear,
  FaChartLine,
  FaTrophy,
  FaBroadcastTower,
} from "react-icons/fa";
import Tabs from "../../components/ui/Tabs";
import AISearchBar from "../../components/ai/AISearchBar"; // Restored Import
import AINewsSummary from "../../components/ai/AINewsSummary"; // Restored Import

const HeroSection = ({ onBrowseClick }) => (
  <div className="relative rounded-xl overflow-hidden mb-8 h-80 flex items-center justify-center text-center text-white bg-gray-800">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-30"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2940&auto=format&fit=crop')",
      }}
    ></div>
    <div className="relative z-10 p-4">
      <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
        Welcome to BetWise
      </h1>
      <p className="text-xl max-w-2xl mx-auto text-gray-300">
        Your ultimate platform for sports betting. Explore upcoming matches, get
        AI-powered insights, and place your bets with confidence.
      </p>
      <Button onClick={onBrowseClick} className="mt-6 !text-lg !px-8 !py-3">
        Browse Games
      </Button>
    </div>
  </div>
);

const EmptyState = ({ icon, title, message }) => (
  <div className="text-center text-gray-500 mt-8 py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <div className="text-4xl text-gray-400 mb-4 mx-auto w-fit">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
      {title}
    </h3>
    <p className="mt-1">{message}</p>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const { games, isLoading } = useGameFeeds();
  const [activeTab, setActiveTab] = useState("upcoming");
  const gamesSectionRef = useRef(null);

  // --- RESTORED: State and handlers for the search bar ---
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchComplete = (games) => {
    setSearchResults(games);
    gamesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };
  // --- END RESTORED ---

  const handleBrowseClick = () => {
    gamesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const tabs = [
    { name: "upcoming", label: "Upcoming" },
    { name: "results", label: "Results" },
  ];

  const renderTabContent = () => {
    if (isLoading && !games[activeTab]?.length) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <GameCardSkeleton />
          <GameCardSkeleton />
        </div>
      );
    }

    let gameData, emptyState;
    switch (activeTab) {
      case "upcoming":
        gameData = games.upcoming;
        emptyState = (
          <EmptyState
            icon={<FaChartLine />}
            title="No Upcoming Games"
            message="Please check back later for new matches."
          />
        );
        break;
      case "results":
        gameData = games.finished;
        emptyState = (
          <EmptyState
            icon={<FaTrophy />}
            title="No Recent Results"
            message="Finished games will appear here."
          />
        );
        break;
      default:
        gameData = [];
        emptyState = null;
    }

    return gameData && gameData.length > 0 ? (
      <GameList games={gameData} />
    ) : (
      emptyState
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <HeroSection onBrowseClick={handleBrowseClick} />

        {/* --- RESTORED: AI Search Bar --- */}
        <AISearchBar
          onSearchComplete={handleSearchComplete}
          onClear={handleClearSearch}
        />

        {/* Live Games Section */}
        {(isLoading || games.live.length > 0) && (
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <FaBroadcastTower className="mr-3 text-red-500 animate-pulse" />{" "}
              Live Matches
            </h2>
            {isLoading && !games.live.length ? (
              <GameCardSkeleton />
            ) : (
              <GameList games={games.live} />
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div ref={gamesSectionRef}>
          {searchResults ? (
            // If there are search results, display them
            <div>
              <h2 className="text-3xl font-bold mb-4">Search Results</h2>
              <GameList games={searchResults} />
            </div>
          ) : (
            // Otherwise, display the tabs
            <div>
              <h2 className="text-3xl font-bold mb-4">Matches & Results</h2>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabClick={setActiveTab}
              />
              <div className="mt-4">{renderTabContent()}</div>
            </div>
          )}
        </div>

        {/* --- RESTORED: AI News Summary for logged-in users --- */}
        {user && (
          <>
            <AINewsSummary />
            <WorldSportsNews />
          </>
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-5">
          <BetSlip />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
