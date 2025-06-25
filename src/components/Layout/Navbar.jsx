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
} from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";
import logoImg from "../../assets/logo.png";
import ThemeToggle from "../ui/ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
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

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  const mobileLinkClass =
    "block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-green-400"
            >
              <img
                src={logoImg}
                alt="BetWise Logo"
                className="h-5 mr-2 -ml-2"
              />
              <span>BetWise</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
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
                    <FaRobot className="mr-1.5" /> AI Assistant
                  </NavLink>
                )}
                {user && (
                  <NavLink to="/my-bets" className={navLinkClass}>
                    My Bets
                  </NavLink>
                )}
                <NavLink to="/promotions" className={navLinkClass}>
                  Promotions
                </NavLink>
                <NavLink to="/support" className={navLinkClass}>
                  Support
                </NavLink>
                <NavLink to="/leaderboards" className={navLinkClass}>
                  <FaTrophy className="mr-1.5" /> Leaderboards
                </NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <div className="text-sm text-green-400 font-semibold">
                  {formatCurrency(balance)}
                </div>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white"
                  >
                    <img
                      src={
                        user.profilePicture ||
                        `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{user.username}</span>
                    <FaChevronDown size={12} />
                  </button>
                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Profile
                      </NavLink>
                      <NavLink
                        to="/wallet"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Wallet
                      </NavLink>
                      <NavLink
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Settings
                      </NavLink>
                      {user.role === "admin" && (
                        <NavLink
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Admin Panel
                        </NavLink>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
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
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/live" className={mobileNavLinkClass}>
              Live
            </NavLink>
            <NavLink to="/aviator" className={mobileNavLinkClass}>
              Aviator
            </NavLink>
            {user && (
              <NavLink to="/assistant" className={mobileNavLinkClass}>
                AI Assistant
              </NavLink>
            )}
            {user && (
              <NavLink to="/my-bets" className={mobileNavLinkClass}>
                My Bets
              </NavLink>
            )}
            <NavLink to="/promotions" className={mobileNavLinkClass}>
              Promotions
            </NavLink>
            <NavLink to="/support" className={mobileNavLinkClass}>
              Support
            </NavLink>
            <NavLink to="/leaderboards" className={mobileNavLinkClass}>
              <FaTrophy className="mr-1.5" /> Leaderboards
            </NavLink>
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
                  <NavLink to="/profile" className={mobileNavLinkClass}>
                    Your Profile
                  </NavLink>
                  <NavLink to="/wallet" className={mobileNavLinkClass}>
                    Wallet
                  </NavLink>
                  <NavLink to="/settings" className={mobileNavLinkClass}>
                    Settings
                  </NavLink>
                  {user.role === "admin" && (
                    <NavLink to="/admin" className={mobileNavLinkClass}>
                      Admin
                    </NavLink>
                  )}
                  <button
                    onClick={logout}
                    className={`${mobileLinkClass} w-full text-left`}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between px-5">
                <div className="space-x-2">
                  <Link to="/login" className={mobileLinkClass}>
                    Login
                  </Link>
                  <Link to="/register" className={mobileLinkClass}>
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
