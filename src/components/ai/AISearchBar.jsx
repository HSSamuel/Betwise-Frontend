import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { searchGamesAI } from "../../services/aiService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { FaSearch, FaTimes } from "react-icons/fa";

const AISearchBar = ({ onSearchComplete, onClear }) => {
  const [query, setQuery] = useState("");
  const { loading, error, request: performSearch } = useApi(searchGamesAI);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const result = await performSearch(query);
    if (result && result.games) {
      onSearchComplete(result.games);
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <form onSubmit={handleSearch} className="flex items-center gap-4">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for games with AI (e.g., 'champions league games today')"
            className="w-full !pl-12 !py-3"
            disabled={loading}
          />
        </div>
        <Button type="submit" loading={loading} disabled={loading}>
          Search
        </Button>
        {query && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={loading}
          >
            <FaTimes />
          </Button>
        )}
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default AISearchBar;
