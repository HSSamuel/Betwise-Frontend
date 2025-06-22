import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatBot from "../ai/AIChatBot";
import { useAuth } from "../../contexts/AuthContext";
import { Sparkles, X as CloseIcon } from "lucide-react";

const MainLayout = () => {
  const { user } = useAuth();
  const [isChatOpen, setChatOpen] = useState(false);

  const handleToggleChat = () => {
    setChatOpen((prev) => !prev);
  };

  return (
    // FIX: Add theme-aware background and text colors to this main wrapper div.
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {user && <AIChatBot isOpen={isChatOpen} onClose={handleToggleChat} />}

      {user && (
        <button
          onClick={handleToggleChat}
          className={`fixed bottom-5 right-5 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 z-50 ${
            isChatOpen
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
          aria-label={isChatOpen ? "Close AI Chat" : "Open AI Chat"}
        >
          {isChatOpen ? <CloseIcon size={28} /> : <Sparkles size={28} />}
        </button>
      )}

      <Footer />
    </div>
  );
};

export default MainLayout;
