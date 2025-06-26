import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatBot from "../ai/AIChatBot";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/AppProviders"; // Import the useChat hook
import { Sparkles, X as CloseIcon } from "lucide-react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-5 w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-gray-600 text-white transition-all duration-300 transform hover:scale-110 z-50 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
};

const MainLayout = () => {
  const { user } = useAuth();
  // The chat state is now managed by the global context.
  const { isChatOpen, toggleChat } = useChat();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* The chatbot now uses the global state and toggle function */}
      {user && <AIChatBot isOpen={isChatOpen} onClose={toggleChat} />}

      {user && (
        <button
          onClick={toggleChat}
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

      <ScrollToTopButton />

      <Footer />
    </div>
  );
};

export default MainLayout;
