import React, { useEffect, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import { getGeneralSportsNews } from "../../services/aiService";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import { FaNewspaper, FaSync } from "react-icons/fa";
import { formatTimeAgo } from "../../utils/formatDate";

const WorldSportsNews = () => {
  // Pass the new option to the useApi hook
  const {
    data,
    loading,
    error,
    request: fetchNews,
  } = useApi(getGeneralSportsNews);

  const handleRefresh = useCallback(() => {
    // FIX: When refreshing, pass the keepPreviousData option
    fetchNews({ keepPreviousData: true });
  }, [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const renderContent = () => {
    if (loading && !data) {
      return <Spinner />;
    }
    if (error) {
      return <p className="text-red-500 text-sm">{error}</p>;
    }
    if (data?.news) {
      return (
        <div className="space-y-4">
          {data.news.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
            >
              <h4 className="font-bold text-md text-green-600 dark:text-green-400">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {item.snippet}
              </p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Source: {item.source}
                </p>
                {item.publishedDate && (
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(item.publishedDate)}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <FaNewspaper className="mr-3 text-gray-400" />
          Top Sports Headlines
        </h3>
        <Button
          variant="outline"
          onClick={handleRefresh} // Use the new handler
          loading={loading}
          disabled={loading}
          className="!p-2"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
        </Button>
      </div>
      {renderContent()}
    </Card>
  );
};

export default WorldSportsNews;
