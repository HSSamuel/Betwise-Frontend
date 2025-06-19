import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { getPerformanceReport } from "../../services/aiService";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { FaSearch } from "react-icons/fa";

const PerformanceAnalyzer = () => {
  const [query, setQuery] = useState("");
  const {
    data: report,
    loading,
    error,
    request: fetchReport,
  } = useApi(getPerformanceReport);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchReport(query);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">AI Performance Analyzer</h3>
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a team or player name..."
          className="flex-grow"
        />
        <Button type="submit" disabled={loading} loading={loading}>
          <FaSearch />
        </Button>
      </form>

      {loading && <Spinner className="mt-4" />}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {report && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200">{report.report}</p>
        </div>
      )}
    </Card>
  );
};

export default PerformanceAnalyzer;
