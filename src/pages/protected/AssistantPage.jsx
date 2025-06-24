import React, { useState, useEffect, useRef } from "react";
import { useApi } from "../../hooks/useApi";
import { handleChat } from "../../services/aiService";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { FaPaperPlane, FaRobot } from "react-icons/fa";

const AssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { loading, request: sendChatMessage } = useApi(handleChat);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting from the assistant
  useEffect(() => {
    if (user?.username) {
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
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = input;
    setInput("");

    const aiResponse = await sendChatMessage(messageToSend, messages.slice(-6));

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

  return (
    <div className="flex flex-col h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <header className="bg-gray-700 text-white p-4 flex items-center rounded-t-lg">
        <FaRobot size={22} className="mr-3 text-green-400" />
        <h3 className="font-bold text-lg">AI Assistant</h3>
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
              className={`max-w-xl px-4 py-3 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-700 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
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
        className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center space-x-2 rounded-b-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 p-2 border-transparent rounded-full bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
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

export default AssistantPage;
