import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import toast from "react-hot-toast";

const BetSlipContext = createContext();

const BetSlipProvider = ({ children }) => {
  // 1. Initialize state from localStorage if available
  const [selections, setSelections] = useState(() => {
    try {
      const savedSelections = localStorage.getItem("betSlipSelections");
      return savedSelections ? JSON.parse(savedSelections) : [];
    } catch (error) {
      console.error("Failed to parse bet slip from local storage", error);
      return [];
    }
  });

  // 2. Save to localStorage whenever selections change
  useEffect(() => {
    localStorage.setItem("betSlipSelections", JSON.stringify(selections));
  }, [selections]);

  const addSelection = (selection) => {
    let toastMessage = "";
    let newSelections = [];

    const prevSelections = [...selections];
    const existingIndex = prevSelections.findIndex(
      (s) => s.gameId === selection.gameId
    );

    if (existingIndex > -1) {
      if (prevSelections[existingIndex].outcome === selection.outcome) {
        // If clicking the same outcome, remove it (toggle off)
        newSelections = prevSelections.filter(
          (s) => s.gameId !== selection.gameId
        );
      } else {
        // If clicking a different outcome for the same game, update it
        newSelections = [...prevSelections];
        newSelections[existingIndex] = selection;
        toastMessage = "Selection updated in your bet slip!";
      }
    } else {
      if (prevSelections.length >= 10) {
        toast.error(
          "You can only have a maximum of 10 selections in a multi-bet."
        );
        newSelections = prevSelections;
      } else {
        newSelections = [...prevSelections, selection];
        toastMessage = "Selection added to your bet slip!";
      }
    }

    setSelections(newSelections);
    if (toastMessage) {
      toast.success(toastMessage);
    }
  };

  const removeSelection = (gameId) => {
    setSelections((prev) => prev.filter((s) => s.gameId !== gameId));
  };

  const clearSelections = () => {
    setSelections([]);
    localStorage.removeItem("betSlipSelections"); // Clear storage too
  };

  const totalOdds = useMemo(() => {
    if (selections.length === 0) return 0;
    return selections.reduce((acc, current) => {
      const odds = parseFloat(current.odds);
      return !isNaN(odds) ? acc * odds : acc;
    }, 1);
  }, [selections]);

  const value = {
    selections,
    addSelection,
    removeSelection,
    clearSelections,
    totalOdds,
  };

  return (
    <BetSlipContext.Provider value={value}>{children}</BetSlipContext.Provider>
  );
};

export const useBetSlip = () => useContext(BetSlipContext);

export default BetSlipProvider;
