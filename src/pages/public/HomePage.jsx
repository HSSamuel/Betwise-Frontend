import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  getGames,
  getPersonalizedFeed,
  getGameSuggestions,
} from "../../services/gameService";
import {
  getRecommendedGames,
  getGeneralSportsNews,
} from "../../services/aiService";
import { useApi } from "../../hooks/useApi";
import GameList from "../../components/Games/GameList";
import BetSlip from "../../components/bets/BetSlip";
import GameCardSkeleton from "../../components/Games/GameCardSkeleton";
import OddsDisplay from "../../components/Games/OddsDisplay";
import { useAuth } from "../../contexts/AuthContext";
import { useGameFeeds } from "../../hooks/useGameFeeds"; // Import the main hook
import AISearchBar from "../../components/ai/AISearchBar";
import AINewsSummary from "../../components/ai/AINewsSummary";
import WorldSportsNews from "../../components/news/WorldSportsNews";
import Button from "../../components/ui/Button";
import { formatDate } from "../../utils/formatDate";
import { FaRegSadTear, FaChartLine, FaTrophy } from "react-icons/fa";

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

const FeaturedGame = ({ game }) => {
  if (!game) return null;
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Featured Match</h2>
      <div className="relative rounded-xl overflow-hidden shadow-2xl text-white bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2940&auto=format&fit=crop')",
          }}
        ></div>
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="font-semibold">{game.league}</span>
            <span className="font-semibold">{formatDate(game.matchDate)}</span>
          </div>
          <div className="flex items-center justify-around text-center my-8">
            <div className="flex-1 flex flex-col items-center space-y-3">
              <img
                src={game.homeTeamLogo || "/default-logo.png"}
                alt={game.homeTeam}
                className="w-24 h-24"
              />
              <span className="font-bold text-2xl tracking-wide">
                {game.homeTeam}
              </span>
            </div>
            <div className="text-5xl font-thin text-gray-400 mx-4">VS</div>
            <div className="flex-1 flex flex-col items-center space-y-3">
              <img
                src={game.awayTeamLogo || "/default-logo.png"}
                alt={game.awayTeam}
                className="w-24 h-24"
              />
              <span className="font-bold text-2xl tracking-wide">
                {game.awayTeam}
              </span>
            </div>
          </div>
          <div className="bg-black bg-opacity-20 p-4 rounded-lg">
            <OddsDisplay game={game} />
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState(user ? "recommend" : "upcoming");

  // --- FIX: Centralized data fetching through the custom hook ---
  const { games, isLoading, fetchAll } = useGameFeeds();
  // --- END FIX ---

  const {
    data: newsData,
    loading: newsLoading,
    error: newsError,
    request: fetchNews,
  } = useApi(getGeneralSportsNews);

  const gamesSectionRef = useRef(null);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleBrowseClick = () => {
    gamesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // FIX: isLoading now correctly reflects all game fetching states
  const pageIsLoading = isLoading || newsLoading;

  const featuredGame = useMemo(() => {
    const gamesForFeatured =
      games.recommendations.length > 0 ? games.recommendations : games.upcoming;
    return gamesForFeatured.length > 0 ? gamesForFeatured[0] : null;
  }, [games.recommendations, games.upcoming]);

  const handleSearchComplete = (searchResultGames) => {
    setSearchResults(searchResultGames);
    gamesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  const renderTabContent = (data, loading, emptyState) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GameCardSkeleton />
          <GameCardSkeleton />
        </div>
      );
    }
    if (!data || data.length === 0) {
      return emptyState;
    }
    return <GameList games={data} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <HeroSection onBrowseClick={handleBrowseClick} />
        {!pageIsLoading && <FeaturedGame game={featuredGame} />}

        <AISearchBar
          onSearchComplete={handleSearchComplete}
          onClear={handleClearSearch}
        />

        {/* FIX: Use the games.live state from the hook, which is now updated by sockets */}
        {(isLoading || games.live.length > 0) && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-red-500 animate-pulse">
              Live Matches
            </h2>
            {renderTabContent(games.live, isLoading, null)}
          </div>
        )}

        {user && (
          <>
            <AINewsSummary />
            <WorldSportsNews
              newsData={newsData}
              loading={newsLoading}
              error={newsError}
            />
          </>
        )}

        <div ref={gamesSectionRef}>
          {searchResults ? (
            <div>
              <h2 className="text-3xl font-bold mb-4">Search Results</h2>
              <GameList games={searchResults} />
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-4">Matches & Results</h2>
              <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                {user && (
                  <>
                    <button
                      onClick={() => setActiveTab("recommend")}
                      className={`px-4 py-2 font-semibold rounded-t-lg ${
                        activeTab === "recommend"
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      Recommended
                    </button>
                    <button
                      onClick={() => setActiveTab("feed")}
                      className={`px-4 py-2 font-semibold rounded-t-lg ${
                        activeTab === "feed"
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      Your Leagues
                    </button>
                    <button
                      onClick={() => setActiveTab("suggestions")}
                      className={`px-4 py-2 font-semibold rounded-t-lg ${
                        activeTab === "suggestions"
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      Suggestions
                    </button>
                  </>
                )}
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-2 font-semibold rounded-t-lg ${
                    activeTab === "upcoming"
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("results")}
                  className={`px-4 py-2 font-semibold rounded-t-lg ${
                    activeTab === "results"
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  Results
                </button>
              </div>

              {/* FIX: Render content using the `games` object from the hook */}
              {activeTab === "upcoming" &&
                renderTabContent(
                  games.upcoming,
                  isLoading,
                  <EmptyState
                    icon={<FaChartLine />}
                    title="No Upcoming Games"
                    message="Please check back later for new matches."
                  />
                )}
              {activeTab === "results" &&
                renderTabContent(
                  games.finished,
                  isLoading,
                  <EmptyState
                    icon={<FaTrophy />}
                    title="No Recent Results"
                    message="Finished games from the last 24 hours will appear here."
                  />
                )}
              {user &&
                activeTab === "recommend" &&
                renderTabContent(
                  games.recommendations,
                  isLoading,
                  <EmptyState
                    icon={<FaRegSadTear />}
                    title="No Recommendations Yet"
                    message="Place some bets to start getting personalized recommendations."
                  />
                )}
              {user &&
                activeTab === "feed" &&
                renderTabContent(
                  games.feed,
                  isLoading,
                  <EmptyState
                    icon={<FaRegSadTear />}
                    title="Your Feed is Empty"
                    message="Bet on games from your favorite leagues to populate this feed."
                  />
                )}
              {user &&
                activeTab === "suggestions" &&
                renderTabContent(
                  games.suggestions,
                  isLoading,
                  <EmptyState
                    icon={<FaRegSadTear />}
                    title="No Suggestions For You"
                    message="We're still learning your preferences! Keep betting to get suggestions."
                  />
                )}
            </div>
          )}
        </div>
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
