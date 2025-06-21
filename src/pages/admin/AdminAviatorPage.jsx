import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../contexts/SocketContext";
import {
  FaPaperPlane,
  FaHourglassStart,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { LuTimer } from "react-icons/lu";

// Game State Constants
const GameState = {
  WAITING: "waiting",
  BETTING: "betting",
  RUNNING: "running",
  CRASHED: "crashed",
};

// Main Component
const AdminAviatorPage = () => {
  const socket = useSocket();
  const [gameState, setGameState] = useState(GameState.WAITING);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(null);
  const [publicHash, setPublicHash] = useState("");

  const gameStateRef = useRef(gameState);

  // --- FIX: This useEffect keeps the ref in sync with the state ---
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  // --- END FIX ---

  useEffect(() => {
    if (socket) {
      console.log(
        "Aviator Page: Socket object received, registering listeners..."
      );
    } else {
      console.warn("Aviator Page: Socket object is null. UI will be static.");
      return; // Exit early if no socket
    }

    const handleStateChange = (data) => {
      setGameState(data.state);
      if (data.state === GameState.BETTING) {
        setPublicHash(data.publicHash);
        setCrashPoint(null);
        setMultiplier(1.0);
      }
    };

    const handleTick = (data) => {
      if (gameStateRef.current === GameState.RUNNING) {
        setMultiplier(data.multiplier);
      }
    };

    const handleCrash = (data) => {
      setGameState(GameState.CRASHED);
      setCrashPoint(data.multiplier);
    };

    socket.on("aviator:state", handleStateChange);
    socket.on("aviator:tick", handleTick);
    socket.on("aviator:crash", handleCrash);

    return () => {
      if (socket) {
        console.log("Aviator Page: Cleaning up socket listeners.");
        socket.off("aviator:state", handleStateChange);
        socket.off("aviator:tick", handleTick);
        socket.off("aviator:crash", handleCrash);
      }
    };
  }, [socket]);

  // Helper function to determine the background color based on the multiplier
  const getBackgroundColor = () => {
    if (gameState === GameState.CRASHED) return "bg-gray-800";
    if (multiplier < 5) return "from-sky-900 to-slate-900";
    if (multiplier < 10) return "from-purple-900 to-slate-900";
    return "from-red-900 to-slate-900";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Aviator Game Monitor
      </h1>

      {/* Main Display Area */}
      <div
        className={`relative w-full h-[50vh] min-h-[400px] bg-gradient-to-br ${getBackgroundColor()} rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-4 transition-all duration-500`}
      >
        {/* Plane Animation */}
        {gameState === GameState.RUNNING && (
          <FaPaperPlane
            className="absolute text-5xl text-white/80 transition-all ease-in-out duration-1000"
            style={{
              left: `${Math.min(multiplier * 2, 85)}%`,
              bottom: `${Math.min(multiplier * 5, 75)}%`,
              transform: `rotate(${Math.min(multiplier * 2 - 45, 10)}deg)`,
            }}
          />
        )}

        {/* Multiplier Display */}
        <div
          className={`text-center transition-transform duration-300 ${
            gameState === GameState.CRASHED ? "animate-shake" : ""
          }`}
        >
          <p
            className={`font-mono text-8xl md:text-9xl font-bold transition-colors duration-300 ${
              gameState === GameState.CRASHED ? "text-red-500" : "text-white"
            }`}
          >
            {(crashPoint || multiplier).toFixed(2)}x
          </p>
        </div>

        {/* Betting Timer Bar */}
        {gameState === GameState.BETTING && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20">
            <div className="h-full bg-green-400 animate-countdown"></div>
          </div>
        )}

        {/* Screen Flash on Crash */}
        {gameState === GameState.CRASHED && (
          <div className="absolute inset-0 bg-red-600/50 animate-ping-once"></div>
        )}
      </div>

      {/* Information Panel */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">Game Status</h3>
          <StatusDisplay gameState={gameState} crashPoint={crashPoint} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">Round Information</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Hash:</strong>{" "}
            <span className="font-mono text-xs break-all">{publicHash}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Sub-component for displaying the current game status
const StatusDisplay = ({ gameState, crashPoint }) => {
  switch (gameState) {
    case GameState.BETTING:
      return (
        <div className="flex items-center text-yellow-500">
          <LuTimer className="mr-3 text-2xl" />
          <div>
            <p className="font-bold">Betting Open</p>
            <p className="text-sm">Place your bets now...</p>
          </div>
        </div>
      );
    case GameState.RUNNING:
      return (
        <div className="flex items-center text-blue-500">
          <FaPaperPlane className="mr-3 text-2xl" />
          <div>
            <p className="font-bold">In Flight</p>
            <p className="text-sm">Multiplier is increasing.</p>
          </div>
        </div>
      );
    case GameState.CRASHED:
      return (
        <div className="flex items-center text-red-500">
          <FaTimesCircle className="mr-3 text-2xl" />
          <div>
            <p className="font-bold">Crashed</p>
            <p className="text-sm">Round ended at {crashPoint?.toFixed(2)}x</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="flex items-center text-gray-500">
          <FaHourglassStart className="mr-3 text-2xl" />
          <div>
            <p className="font-bold">Waiting</p>
            <p className="text-sm">Waiting for the next round to begin.</p>
          </div>
        </div>
      );
  }
};

export default AdminAviatorPage;
