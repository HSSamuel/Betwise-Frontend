import React, { useState, useEffect, useRef } from "react";
import { useApi } from "../../hooks/useApi";
import { handleChat } from "../../services/aiService";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { FaPaperPlane, FaRobot } from "react-icons/fa";

// Suggestion Chips Component
const SuggestionChips = ({ onSelect }) => {
  const suggestions = [
    "What's my balance?",
    "Show my recent bets",
    "Find upcoming Premier League games",
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-2">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {text}
        </button>
      ))}
    </div>
  );
};

const AssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { loading, request: sendChatMessage } = useApi(handleChat);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || loading) return;

    const userMessage = { role: "user", parts: [{ text: messageText }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const aiResponse = await sendChatMessage(messageText, messages.slice(-6));

    if (aiResponse?.reply) {
      const aiMessage = { role: "model", parts: [{ text: aiResponse.reply }] };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChipSelect = (text) => {
    setInput(text);
    sendMessage(text);
  };

  useEffect(() => {
    if (user?.username && messages.length === 0) {
      setMessages([
        {
          role: "model",
          parts: [
            {
              text: `Hello ${user.username}! How can I help you today? You can ask me about your balance, recent bets, or even to find a game.`,
            },
          ],
        },
      ]);
    }
  }, [user, messages.length]);

  return (
    <div className="flex flex-col h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      <header className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4 flex items-center rounded-t-lg border-b dark:border-gray-700">
        <FaRobot size={22} className="mr-3 text-green-500" />
        <h3 className="font-bold text-lg">AI Assistant</h3>
      </header>

      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2.5 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "model" && (
              <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <FaRobot className="text-green-400" />
              </div>
            )}
            <div
              className={`max-w-xl px-4 py-3 rounded-2xl shadow ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-700 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
            </div>
            {msg.role === "user" && (
              <img
                src={
                  user.profilePicture ||
                  `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
                }
                alt="You"
                className="w-9 h-9 rounded-full object-cover"
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mr-2.5">
              <FaRobot className="text-green-400" />
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-bl-none rounded-2xl p-4 shadow">
              <Spinner size="sm" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && <SuggestionChips onSelect={handleChipSelect} />}

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center space-x-3 rounded-b-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 p-3 border-gray-200 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
          disabled={loading}
        />
        <Button
          type="submit"
          loading={loading}
          className="rounded-full w-12 h-12 flex-shrink-0"
          aria-label="Send message"
        >
          <FaPaperPlane />
        </Button>
      </form>
    </div>
  );
};

export default AssistantPage;
