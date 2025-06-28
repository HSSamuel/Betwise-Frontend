import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { placeAviatorBet, cashOutAviator } from "../../services/gameService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { FaPaperPlane, FaMoneyBillWave } from "react-icons/fa";

const AviatorPage = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  // ** FIX: Provide a default initial state to prevent render errors **
  const [gameState, setGameState] = useState({
    status: "connecting", // 'connecting', 'waiting', 'betting', 'playing', 'crashed'
    multiplier: 1.0,
    bets: [],
    crashPoint: null,
    publicHash: null,
  });

  const [myBets, setMyBets] = useState([]);
  const [betAmount, setBetAmount] = useState("10");
  const [autoCashOut, setAutoCashOut] = useState("2.0");
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const planeRef = useRef({ x: 0, y: 250 });
  const lastTimeRef = useRef(null);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("get_aviator_state"); // Request the current state upon connection

      const onStateUpdate = (state) => setGameState(state);
      const onBetPlaced = (bets) => setGameState((prev) => ({ ...prev, bets }));
      const onBetCashedOut = (bet) => {
        setGameState((prev) => ({
          ...prev,
          bets: prev.bets.map((b) =>
            b.userId === bet.userId ? { ...b, status: "cashed_out" } : b
          ),
        }));
        if (bet.userId === user?.id) {
          setMyBets((prev) =>
            prev.map((b) =>
              b.status === "pending" ? { ...b, status: "cashed_out" } : b
            )
          );
        }
      };
      const onNewRound = (newState) => {
        setGameState(newState);
        setMyBets([]); // Clear my bets for the new round
      };
      const onHistoryUpdate = (newHistory) => setHistory(newHistory);

      socket.on("aviator_state", onStateUpdate);
      socket.on("aviator_bet_placed", onBetPlaced);
      socket.on("aviator_bet_cashed_out", onBetCashedOut);
      socket.on("aviator_new_round", onNewRound);
      socket.on("aviator_history", onHistoryUpdate);

      return () => {
        socket.off("aviator_state", onStateUpdate);
        socket.off("aviator_bet_placed", onBetPlaced);
        socket.off("aviator_bet_cashed_out", onBetCashedOut);
        socket.off("aviator_new_round", onNewRound);
        socket.off("aviator_history", onHistoryUpdate);
      };
    }
  }, [socket, isConnected, user?.id]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const now = Date.now();
    if (lastTimeRef.current === null) lastTimeRef.current = now;
    const deltaTime = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#1a202c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState.status === "playing") {
      const timeSinceStart = (Date.now() - gameState.startTime) / 1000;
      planeRef.current.x = ((timeSinceStart * 50) % (canvas.width + 50)) - 50;
      planeRef.current.y = canvas.height - 50 - timeSinceStart * 30;
    } else if (
      gameState.status === "betting" ||
      gameState.status === "waiting"
    ) {
      planeRef.current = { x: 0, y: canvas.height - 50 };
    }

    // Draw plane
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("✈️", planeRef.current.x, planeRef.current.y);

    requestAnimationFrame(draw);
  }, [gameState.status, gameState.startTime]);

  useEffect(() => {
    requestAnimationFrame(draw);
  }, [draw]);

  const handlePlaceBet = async () => {
    try {
      const result = await placeAviatorBet(betAmount, autoCashOut);
      toast.success("Bet placed successfully!");
      setMyBets((prev) => [
        ...prev,
        { amount: betAmount, status: "pending", betId: result._id },
      ]);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to place bet.");
    }
  };

  const handleCashOut = async () => {
    try {
      const result = await cashOutAviator();
      toast.success(
        `Cashed out at ${result.multiplier.toFixed(
          2
        )}x! You won $${result.payout.toFixed(2)}`
      );
    } catch (err) {
      toast.error(err.response?.data?.msg || "Cash out failed.");
    }
  };

  const canBet =
    gameState.status === "betting" &&
    !myBets.some((b) => b.status === "pending");
  const canCashOut =
    gameState.status === "playing" &&
    myBets.some((b) => b.status === "pending");

  return (
    <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto p-4">
      {/* Game Area */}
      <div className="flex-grow bg-gray-900 rounded-lg relative overflow-hidden aspect-video">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          width="800"
          height="450"
        ></canvas>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <h2
              className={`text-6xl font-bold transition-colors duration-300 ${
                gameState.status === "crashed" ? "text-red-500" : "text-white"
              }`}
            >
              {/* ** FIX: Safely access multiplier with a default value ** */}
              {(gameState.multiplier ?? 1.0).toFixed(2)}x
            </h2>
            <p className="text-white/50 text-sm mt-2">
              {gameState.status === "connecting"
                ? "Connecting to game..."
                : gameState.status === "betting"
                ? "Place your bets now!"
                : gameState.status === "crashed"
                ? `Crashed @ ${gameState.crashPoint?.toFixed(2)}x`
                : gameState.status}
            </p>
          </div>
        </div>
        {/* History Bar */}
        <div className="absolute top-2 left-2 flex gap-2">
          {history.slice(0, 10).map((h) => (
            <span
              key={h._id}
              className={`px-2 py-1 text-xs font-bold rounded ${
                h.crashPoint > 1.99 ? "bg-green-500" : "bg-blue-500"
              }`}
            >
              {h.crashPoint.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="Bet Amount"
            className="col-span-1"
          />
          <Input
            type="number"
            value={autoCashOut}
            onChange={(e) => setAutoCashOut(e.target.value)}
            placeholder="Auto Cash-out"
            className="col-span-1"
          />
        </div>
        <Button
          onClick={handlePlaceBet}
          disabled={!canBet}
          className="w-full mt-4 !py-4 !text-lg"
        >
          <FaPaperPlane className="mr-2" /> Place Bet
        </Button>
        <Button
          onClick={handleCashOut}
          disabled={!canCashOut}
          className="w-full mt-2 !py-4 !text-lg"
          variant="secondary"
        >
          <FaMoneyBillWave className="mr-2" /> Cash Out
        </Button>

        <div className="mt-4 text-white">
          <h3 className="font-bold border-b border-gray-700 pb-1 mb-2">
            Current Bets ({gameState.bets.length})
          </h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {gameState.bets.map((b) => (
              <div
                key={b.userId}
                className={`flex justify-between items-center p-1 rounded text-xs ${
                  b.status === "cashed_out"
                    ? "bg-green-500/20"
                    : "bg-gray-700/50"
                }`}
              >
                <span>{b.username}</span>
                <span className="font-bold">${b.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviatorPage;
