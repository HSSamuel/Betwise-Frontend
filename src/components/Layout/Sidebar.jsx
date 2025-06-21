// In: Bet/Frontend/src/components/Layout/Sidebar.jsx

import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaGamepad,
  FaMoneyBillWave,
  FaShieldAlt,
  FaHome,
  FaPaperPlane,
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const linkClass =
    "flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white group transition-all duration-200";
  const activeLinkClass =
    "bg-gradient-to-r from-green-500 to-teal-400 text-white font-bold shadow-md";

  const handleLinkClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-gray-100 z-20 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="p-4 mb-4 border-b border-gray-700">
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-white"
            onClick={handleLinkClick}
          >
            {/* The icon in the header was FaBolt, which is not imported. I've changed it to FaPaperPlane which is used elsewhere */}
            <FaPaperPlane className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold tracking-wider">BetWise</span>
          </Link>
        </div>

        {/* FIX: Use flexbox to structure the sidebar content vertically */}
        <div className="flex flex-col justify-between h-full px-3 pb-4 overflow-y-auto">
          {/* Main Admin Links */}
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeLinkClass : ""}`
                }
                onClick={handleLinkClick}
              >
                {/* FIX: Added text color to the icon */}
                <FaTachometerAlt className="w-5 h-5 text-blue-400" />
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeLinkClass : ""}`
                }
                onClick={handleLinkClick}
              >
                {/* FIX: Added text color to the icon */}
                <FaUsers className="w-5 h-5 text-sky-400" />
                <span className="flex-1 ms-3">Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/games"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeLinkClass : ""}`
                }
                onClick={handleLinkClick}
              >
                {/* FIX: Added text color to the icon */}
                <FaGamepad className="w-5 h-5 text-pink-400" />
                <span className="flex-1 ms-3">Games</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/withdrawals"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeLinkClass : ""}`
                }
                onClick={handleLinkClick}
              >
                {/* FIX: Added text color to the icon */}
                <FaMoneyBillWave className="w-5 h-5 text-green-400" />
                <span className="flex-1 ms-3">Withdrawals</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/risk"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeLinkClass : ""}`
                }
                onClick={handleLinkClick}
              >
                {/* FIX: Added text color to the icon */}
                <FaShieldAlt className="w-5 h-5 text-red-400" />
                <span className="flex-1 ms-3">Risk Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/aviator"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeLinkClass : ""}`
                }
                onClick={handleLinkClick}
              >
                {/* FIX: Added text color to the icon */}
                <FaPaperPlane className="w-5 h-5 text-indigo-400" />
                <span className="flex-1 ms-3">Aviator Monitor</span>
              </NavLink>
            </li>
          </ul>

          {/* "Back to Site" Link - flexbox will push this to the bottom */}
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-700">
            <li>
              <Link to="/" className={linkClass} onClick={handleLinkClick}>
                <FaHome className="w-5 h-5 text-gray-400" />
                <span className="ms-3">Back to Site</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
