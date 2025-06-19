// In: Bet/Frontend/src/components/ai/AISearchBar.jsx
import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { searchGamesAI } from "../../services/gameService";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { FaSearch } from "react-icons/fa";

const AISearchBar = ({ onSearchComplete, onClear }) => {
  const [query, setQuery] = useState("");
  const { loading, request: performSearch } = useApi(searchGamesAI);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const result = await performSearch(query);
    if (result) {
      onSearchComplete(result.games);
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'Show me games in England today...'"
          className="flex-grow"
        />
        <Button type="submit" disabled={loading} loading={loading}>
          <FaSearch />
        </Button>
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </form>
    </div>
  );
};

export default AISearchBar;
