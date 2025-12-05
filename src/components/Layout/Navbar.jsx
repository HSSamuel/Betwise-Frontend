import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWallet } from "../../contexts/WalletContext";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaRobot,
  FaTrophy,
  FaGift,
  FaLifeRing,
  FaEllipsisH, // Added for the "More" icon
} from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";
import logoImg from "../../assets/logo.png";
import ThemeToggle from "../ui/ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  // --- NEW: State for the "More" dropdown ---
  const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const moreMenuRef = useRef(null); // --- NEW: Ref for the "More" dropdown ---

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close User Menu
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      // --- NEW: Close More Menu ---
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  // Style for dropdown items (distinct from main nav links)
  const dropdownItemClass = ({ isActive }) =>
    `block px-4 py-2 text-sm transition-colors ${
      isActive
        ? "bg-green-100 text-green-700 dark:bg-gray-600 dark:text-white"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  const mobileLinkClass =
    "block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav className="bg-gray-800 sticky top-0 z-50 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-green-400 flex-shrink-0"
            >
              <img
                src={logoImg}
                alt="BetWise Logo"
                className="h-6 mr-2" // Adjusted size slightly
              />
              <span>BetWise</span>
            </Link>

            {/* --- DESKTOP NAVIGATION --- */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2 lg:space-x-4">
                {/* Primary Links */}
                <NavLink to="/" className={navLinkClass} end>
                  Home
                </NavLink>
                <NavLink to="/live" className={navLinkClass}>
                  Live
                </NavLink>
                <NavLink to="/aviator" className={navLinkClass}>
                  Aviator
                </NavLink>
                {user && (
                  <NavLink to="/assistant" className={navLinkClass}>
                    <FaRobot className="mr-1.5 inline" /> AI Assistant
                  </NavLink>
                )}
                {user && (
                  <NavLink to="/my-bets" className={navLinkClass}>
                    My Bets
                  </NavLink>
                )}

                {/* --- NEW: "More" Dropdown for Secondary Links --- */}
                <div className="relative ml-2" ref={moreMenuRef}>
                  <button
                    onClick={() => setMoreMenuOpen(!isMoreMenuOpen)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
                  >
                    More{" "}
                    <FaChevronDown
                      className={`ml-1.5 h-3 w-3 transition-transform ${
                        isMoreMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMoreMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50 animate-fade-in-down">
                      <NavLink to="/promotions" className={dropdownItemClass}>
                        <FaGift className="mr-2 inline text-yellow-500" />{" "}
                        Promotions
                      </NavLink>
                      <NavLink to="/leaderboards" className={dropdownItemClass}>
                        <FaTrophy className="mr-2 inline text-orange-400" />{" "}
                        Leaderboards
                      </NavLink>
                      <NavLink to="/support" className={dropdownItemClass}>
                        <FaLifeRing className="mr-2 inline text-blue-400" />{" "}
                        Support
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- USER PROFILE & THEME (Right Side) --- */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <div className="text-sm text-green-400 font-bold bg-gray-700 px-3 py-1 rounded-full">
                  {formatCurrency(balance)}
                </div>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
                  >
                    <img
                      src={
                        user.profilePicture ||
                        `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                    />
                    <span className="max-w-[100px] truncate">
                      {user.username}
                    </span>
                    <FaChevronDown className="h-3 w-3" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </NavLink>
                      <NavLink
                        to="/wallet"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Wallet
                      </NavLink>
                      <NavLink
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </NavLink>
                      {user.role === "admin" && (
                        <NavLink
                          to="/admin"
                          className="block px-4 py-2 text-sm text-purple-600 dark:text-purple-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Panel
                        </NavLink>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 border-t dark:border-gray-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (Drawer) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/live"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Live
            </NavLink>
            <NavLink
              to="/aviator"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Aviator
            </NavLink>
            {user && (
              <NavLink
                to="/assistant"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaRobot className="inline mr-2" /> AI Assistant
              </NavLink>
            )}
            {user && (
              <NavLink
                to="/my-bets"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bets
              </NavLink>
            )}
            <div className="border-t border-gray-700 my-2 pt-2">
              <NavLink
                to="/promotions"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaGift className="inline mr-2 text-yellow-500" /> Promotions
              </NavLink>
              <NavLink
                to="/leaderboards"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTrophy className="inline mr-2 text-orange-400" />{" "}
                Leaderboards
              </NavLink>
              <NavLink
                to="/support"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaLifeRing className="inline mr-2 text-blue-400" /> Support
              </NavLink>
            </div>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-700">
            {user ? (
              <>
                <div className="flex items-center justify-between px-5">
                  <div className="flex items-center">
                    <img
                      src={
                        user.profilePicture ||
                        `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {user.username}
                      </div>
                      <div className="text-sm font-medium text-green-400 mt-1">
                        {formatCurrency(balance)}
                      </div>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <NavLink
                    to="/profile"
                    className={mobileLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Your Profile
                  </NavLink>
                  <NavLink
                    to="/wallet"
                    className={mobileLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wallet
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className={mobileLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </NavLink>
                  {user.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className={`${mobileLinkClass} text-purple-400`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </NavLink>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className={`${mobileLinkClass} w-full text-left text-red-400`}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between px-5 py-2">
                <div className="space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-md font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
