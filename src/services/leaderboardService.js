import api from "./api";

// Fetch leaderboard for top winners, with optional time period
export const getTopWinnersLeaderboard = async (period = "all-time") => {
  const response = await api.get(`/leaderboards/winners`, {
    params: { period },
  });
  return response.data;
};

// Fetch leaderboard for highest odds wins
export const getHighestOddsLeaderboard = async () => {
  const response = await api.get(`/leaderboards/highest-odds`);
  return response.data;
};
