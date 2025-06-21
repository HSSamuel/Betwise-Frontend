import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useApi } from "../../hooks/useApi";
import { handleChat } from "../../services/aiService";
import { useAuth } from "../../contexts/AuthContext";
import { useBetSlip } from "../../contexts/BetSlipContext";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { FaPaperPlane, FaTimes, FaRobot } from "react-icons/fa";

const AIChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const { loading, request: sendChatMessage } = useApi(handleChat);
  const { user } = useAuth();
  const { addSelection } = useBetSlip();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);

    const context = pendingAction;
    setPendingAction(null);
    const messageToSend = input;
    setInput("");

    const aiResponse = await sendChatMessage(
      messageToSend,
      messages.slice(-6),
      context
    );

    if (aiResponse && aiResponse.reply) {
      const aiMessage = { role: "model", parts: [{ text: aiResponse.reply }] };

      if (aiResponse.betSlip) {
        setPendingAction({
          action: "CONFIRM_BET",
          betSlip: aiResponse.betSlip,
        });
        const { gameId, outcome, gameDetails, oddsAtTimeOfBet } =
          aiResponse.betSlip;
        const odds =
          outcome === "A"
            ? oddsAtTimeOfBet.home
            : outcome === "B"
            ? oddsAtTimeOfBet.away
            : oddsAtTimeOfBet.draw;
        addSelection({ gameId, outcome, gameDetails, odds });
        toast.success("Bet added to your slip! Please confirm in the chat.");
      }
      setMessages((prev) => [...prev, aiMessage]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Sorry, I encountered an error. Please try again." }],
        },
      ]);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0 && user) {
      setMessages([
        {
          role: "model",
          parts: [
            {
              text: `Hello ${user.username}! Ask me to place a bet, or ask about sports.`,
            },
          ],
        },
      ]);
    }
  }, [isOpen, user, messages.length]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 left-4 h-[65vh] max-h-[520px] bg-white dark:bg-gray-800 flex flex-col z-50 rounded-2xl shadow-2xl border dark:border-gray-700 md:w-96 md:h-[520px] md:left-auto">
      <header className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 flex justify-between items-center rounded-t-2xl flex-shrink-0">
        <div className="flex items-center space-x-3">
          <FaRobot size={22} className="text-green-400" />
          <h3 className="font-bold text-lg">BetWise AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <FaRobot className="text-green-400" />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl px-4 py-3 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-700 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 rounded-bl-none rounded-2xl p-3">
              <Spinner size="sm" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center space-x-2 rounded-b-2xl"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Bet $10 on Man U"
          className="flex-1 p-2 border-transparent rounded-full dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
          disabled={loading}
        />
        <Button
          type="submit"
          loading={loading}
          className="rounded-full w-12 h-12 flex-shrink-0"
        >
          <FaPaperPlane />
        </Button>
      </form>
    </div>
  );
};

export default AIChatBot;
