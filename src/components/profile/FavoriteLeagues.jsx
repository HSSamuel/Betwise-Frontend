import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { updateProfile, getProfile } from "../../services/userService";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import { FaStar, FaCheck } from "react-icons/fa";

const POPULAR_LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "UEFA Champions League",
  "MLS",
  "NBA", // Example additional sport
  "NFL",
];

const FavoriteLeagues = () => {
  const [selectedLeagues, setSelectedLeagues] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  const {
    data: profile,
    loading: loadingProfile,
    request: fetchProfile,
  } = useApi(getProfile);

  const { loading: saving, request: saveProfile } = useApi(updateProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.favoriteLeagues) {
      setSelectedLeagues(profile.favoriteLeagues);
    }
  }, [profile]);

  const toggleLeague = (league) => {
    setIsChanged(true);
    setSelectedLeagues((prev) => {
      if (prev.includes(league)) {
        return prev.filter((l) => l !== league);
      } else {
        return [...prev, league];
      }
    });
  };

  const handleSave = async () => {
    const result = await saveProfile({ favoriteLeagues: selectedLeagues });
    if (result) {
      toast.success("Favorite leagues updated!");
      setIsChanged(false);
    }
  };

  if (loadingProfile) return <Spinner />;

  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Select your favorite leagues to personalize your home feed and get
        tailored AI recommendations.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        {POPULAR_LEAGUES.map((league) => {
          const isSelected = selectedLeagues.includes(league);
          return (
            <button
              key={league}
              onClick={() => toggleLeague(league)}
              className={`
                flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  isSelected
                    ? "bg-green-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
            >
              {isSelected && <FaCheck className="mr-2 text-xs" />}
              {league}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          loading={saving}
          disabled={!isChanged || saving}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default FavoriteLeagues;
