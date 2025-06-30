import React, { useState, useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { FaPaperPlane } from "react-icons/fa";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input"; // --- Correction: Added missing import ---

const GameState = {
  WAITING: "waiting",
  BETTING: "betting",
  RUNNING: "running",
  CRASHED: "crashed",
};

const AviatorPage = () => {
  const { socket } = useSocket();
  const [gameState, setGameState] = useState(GameState.WAITING);
  const [multiplier, setMultiplier] = useState(1.0);
  const [stake, setStake] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [canCashOut, setCanCashOut] = useState(false);

  // Fetch initial state
  useEffect(() => {
    const fetchState = async () => {
      try {
        const { data } = await api.get("/aviator/state");
        setGameState(data.state);
        setMultiplier(data.multiplier);
      } catch (error) {
        console.error("Failed to fetch initial aviator state", error);
      }
    };
    fetchState();
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleStateChange = (data) => {
      setGameState(data.state);
      setHasBet(false);
      setCanCashOut(false);
      if (data.state === GameState.BETTING) {
        setMultiplier(1.0);
      }
    };
    const handleTick = (data) => setMultiplier(data.multiplier);
    const handleCrash = () => {
      setGameState(GameState.CRASHED);
      setCanCashOut(false);
    };

    socket.on("aviator:state", handleStateChange);
    socket.on("aviator:tick", handleTick);
    socket.on("aviator:crash", handleCrash);

    return () => {
      socket.off("aviator:state", handleStateChange);
      socket.off("aviator:tick", handleTick);
      socket.off("aviator:crash", handleCrash);
    };
  }, [socket]);

  const handlePlaceBet = async () => {
    try {
      await api.post("/aviator/place-bet", { stake });
      toast.success("Bet placed!");
      setHasBet(true);
      setCanCashOut(true);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to place bet.");
    }
  };

  const handleCashOut = async () => {
    try {
      const { data } = await api.post("/aviator/cash-out");
      toast.success(
        `Cashed out at ${data.multiplier}x for $${data.payout.toFixed(2)}!`
      );
      setCanCashOut(false);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to cash out.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-4xl h-[60vh] bg-gray-900 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
        {gameState === GameState.RUNNING && (
          <FaPaperPlane
            className="absolute text-4xl text-white transition-all duration-100 ease-linear"
            style={{
              left: `${Math.min(multiplier * 1.5, 90)}%`,
              bottom: `${Math.min(multiplier * 4, 80)}%`,
            }}
          />
        )}
        <span
          className={`font-mono text-8xl font-bold ${
            gameState === GameState.CRASHED ? "text-red-500" : "text-white"
          }`}
        >
          {multiplier.toFixed(2)}x
        </span>
        {gameState === GameState.BETTING && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20">
            <div className="h-full bg-green-400 animate-countdown"></div>
          </div>
        )}
      </div>
      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-4xl flex items-center justify-center space-x-4">
        <Input
          type="number"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          className="w-32"
        />
        {canCashOut ? (
          <Button
            onClick={handleCashOut}
            className="w-48 bg-purple-600 hover:bg-purple-700"
          >
            Cash Out
          </Button>
        ) : (
          <Button
            onClick={handlePlaceBet}
            disabled={gameState !== GameState.BETTING || hasBet}
            className="w-48"
          >
            {hasBet ? "Waiting for Next Round" : "Place Bet"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AviatorPage;
