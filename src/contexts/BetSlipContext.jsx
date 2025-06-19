// In: src/contexts/BetSlipContext.jsx

import React, { createContext, useState, useContext, useMemo } from "react";
import toast from "react-hot-toast";

const BetSlipContext = createContext();

// FIX: Remove 'export' from here to make it a regular constant
const BetSlipProvider = ({ children }) => {
  const [selections, setSelections] = useState([]);

  const addSelection = (selection) => {
    let toastMessage = "";
    let newSelections = [];

    const prevSelections = [...selections];
    const existingIndex = prevSelections.findIndex(
      (s) => s.gameId === selection.gameId
    );

    if (existingIndex > -1) {
      if (prevSelections[existingIndex].outcome === selection.outcome) {
        newSelections = prevSelections.filter(
          (s) => s.gameId !== selection.gameId
        );
      } else {
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

// FIX: Add the component as the default export
export default BetSlipProvider;
