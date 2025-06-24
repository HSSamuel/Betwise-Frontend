import React, { useState, useRef, useMemo } from "react";
import { useGameFeeds } from "../../hooks/useGameFeeds";
import GameList from "../../components/Games/GameList";
import BetSlip from "../../components/bets/BetSlip";
import GameCardSkeleton from "../../components/Games/GameCardSkeleton";
import { useAuth } from "../../contexts/AuthContext";
import WorldSportsNews from "../../components/news/WorldSportsNews";
import Button from "../../components/ui/Button";
import {
  FaRegSadTear,
  FaChartLine,
  FaTrophy,
  FaBroadcastTower,
} from "react-icons/fa";
import Tabs from "../../components/ui/Tabs";
import AISearchBar from "../../components/ai/AISearchBar";
import AINewsSummary from "../../components/ai/AINewsSummary";
import { formatTimeAgo } from "../../utils/formatDate";
import { useSocket } from "../../contexts/SocketContext";

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
  const { isConnected } = useSocket();
  const [activeTab, setActiveTab] = useState("upcoming");
  const gamesSectionRef = useRef(null);

  const [searchResults, setSearchResults] = useState(null);

  // FIX: Group upcoming games by league using useMemo for efficiency
  const upcomingGamesByLeague = useMemo(() => {
    if (!games.upcoming) return {};
    return games.upcoming.reduce((acc, game) => {
      const league = game.league || "Other";
      if (!acc[league]) {
        acc[league] = [];
      }
      acc[league].push(game);
      return acc;
    }, {});
  }, [games.upcoming]);

  const handleSearchComplete = (games) => {
    setSearchResults(games);
    gamesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  const handleBrowseClick = () => {
    gamesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const tabs = [
    { name: "upcoming", label: "Upcoming" },
    { name: "results", label: "Results" },
  ];

  const renderTabContent = () => {
    if (
      isLoading &&
      !games[activeTab]?.length &&
      Object.keys(upcomingGamesByLeague).length === 0
    ) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <GameCardSkeleton />
          <GameCardSkeleton />
        </div>
      );
    }

    switch (activeTab) {
      case "upcoming":
        const upcomingLeagues = Object.keys(upcomingGamesByLeague);
        if (upcomingLeagues.length > 0) {
          return (
            <div className="space-y-8">
              {upcomingLeagues.map((league) => (
                <div key={league}>
                  <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                    {league}
                  </h2>
                  <GameList
                    games={upcomingGamesByLeague[league]}
                    isConnected={isConnected}
                  />
                </div>
              ))}
            </div>
          );
        }
        return (
          <EmptyState
            icon={<FaChartLine />}
            title="No Upcoming Games"
            message="Please check back later for new matches."
          />
        );

      case "results":
        if (games.finished && games.finished.length > 0) {
          return <GameList games={games.finished} isConnected={isConnected} />;
        }
        return (
          <EmptyState
            icon={<FaTrophy />}
            title="No Recent Results"
            message="Finished games will appear here."
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <HeroSection onBrowseClick={handleBrowseClick} />

        <AISearchBar
          onSearchComplete={handleSearchComplete}
          onClear={handleClearSearch}
        />

        <div ref={gamesSectionRef}>
          {searchResults ? (
            <div>
              <h2 className="text-3xl font-bold mb-4">Search Results</h2>
              <GameList games={searchResults} isConnected={isConnected} />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Matches & Results</h2>
                <Tabs
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabClick={setActiveTab}
                />
              </div>
              <div className="mt-4">{renderTabContent()}</div>
            </div>
          )}
        </div>

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
