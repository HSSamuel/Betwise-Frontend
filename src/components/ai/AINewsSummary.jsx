import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { getNewsSummary } from "../../services/aiService";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

const AINewsSummary = () => {
  const [topic, setTopic] = useState("");
  const {
    data,
    loading,
    error,
    request: fetchSummary,
  } = useApi(getNewsSummary);

  const handleSearch = (e) => {
    e.preventDefault();
    // This check prevents the request if the input is empty
    if (topic.trim()) {
      fetchSummary(topic);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">AI News & Performance Summary</h3>
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <Input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a team or player name..."
          className="flex-grow"
        />
        <Button type="submit" disabled={loading} loading={loading}>
          Get Summary
        </Button>
      </form>

      {loading && (
        <div className="mt-4">
          <Spinner />
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {data && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200">{data.summary}</p>
        </div>
      )}
    </Card>
  );
};

export default AINewsSummary;
