import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaGamepad,
  FaMoneyBillWave,
  FaShieldAlt,
  FaHome,
  FaBolt, // A new icon for the brand
} from "react-icons/fa";

// Accept sidebarOpen and setSidebarOpen as props
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  // 1. UPDATE THE STYLING CLASSES FOR THE NAVIGATION LINKS
  const linkClass =
    "flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white group transition-all duration-200";
  const activeLinkClass =
    "bg-gradient-to-r from-green-500 to-teal-400 text-white font-bold shadow-md";

  // Function to close sidebar on link click (for mobile)
  const handleLinkClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* --- Overlay (for mobile view when sidebar is open) --- */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* --- Sidebar --- */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-gray-100 z-20 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        {/* 2. ADD A BRANDED HEADER TO THE SIDEBAR */}
        <div className="p-4 mb-4 border-b border-gray-700">
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-white"
            onClick={handleLinkClick}
          >
            <FaBolt className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold tracking-wider">BetWise</span>
          </Link>
        </div>

        <div className="h-full px-3 py-4 overflow-y-auto">
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
                <FaTachometerAlt className="w-5 h-5" />
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
                <FaUsers className="w-5 h-5" />
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
                <FaGamepad className="w-5 h-5" />
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
                <FaMoneyBillWave className="w-5 h-5" />
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
                <FaShieldAlt className="w-5 h-5" />
                <span className="flex-1 ms-3">Risk Management</span>
              </NavLink>
            </li>
          </ul>

          {/* "Back to Site" Link */}
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-700">
            <li>
              <Link to="/" className={linkClass} onClick={handleLinkClick}>
                <FaHome className="w-5 h-5" />
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
