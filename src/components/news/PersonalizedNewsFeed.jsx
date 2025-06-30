import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { getPersonalizedNewsFeed } from "../../services/aiService";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";

const PersonalizedNewsFeed = () => {
  const {
    data,
    loading,
    error,
    request: fetchPersonalizedNews,
  } = useApi(getPersonalizedNewsFeed);

  useEffect(() => {
    fetchPersonalizedNews();
  }, [fetchPersonalizedNews]);

  if (loading) {
    return (
      <Card>
        <h3 className="text-xl font-bold mb-4">For You</h3>
        <Spinner />
      </Card>
    );
  }

  if (error) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">For You</h3>
      {data && data.news && data.news.length > 0 ? (
        <div className="space-y-4">
          {data.news.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <h4 className="font-bold text-md">{item.team}</h4>
              {/* FIX: Add whitespace-pre-wrap to respect newlines from the AI */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          No personalized news available. Start betting on teams to see updates
          here!
        </p>
      )}
    </Card>
  );
};

export default PersonalizedNewsFeed;
