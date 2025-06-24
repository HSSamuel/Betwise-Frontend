import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import {
  FaTachometerAlt,
  FaUsers,
  FaGamepad,
  FaMoneyBillWave,
  FaShieldAlt,
  FaHome,
  FaPaperPlane,
  FaGift, // --- Correction: Added the missing FaGift icon to the import list ---
} from "react-icons/fa";

const navLinks = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: FaTachometerAlt,
    end: true,
    color: "text-blue-400",
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: FaUsers,
    color: "text-sky-400",
  },
  {
    path: "/admin/games",
    label: "Games",
    icon: FaGamepad,
    color: "text-pink-400",
  },
  {
    path: "/admin/withdrawals",
    label: "Withdrawals",
    icon: FaMoneyBillWave,
    color: "text-green-400",
  },
  {
    path: "/admin/risk",
    label: "Risk Management",
    icon: FaShieldAlt,
    color: "text-red-400",
  },
  {
    path: "/admin/aviator",
    label: "Aviator Monitor",
    icon: FaPaperPlane,
    color: "text-indigo-400",
  },
  {
    path: "/admin/promotions",
    label: "Promotions",
    icon: FaGift,
    color: "text-yellow-400",
  },
   {
    path: "/admin/rankings",
    label: "Rankings",
    icon: FaStar,
    color: "text-orange-400",
  },
  { type: "divider" },
  {
    path: "/",
    label: "Back to Site",
    icon: FaHome,
    isLink: true,
    color: "text-gray-400",
  },
];

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
            <FaPaperPlane className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold tracking-wider">BetWise</span>
          </Link>
        </div>

        {/* --- UNIFIED MENU --- */}
        {/* This single block now renders all links for both mobile and desktop */}
        <div className="px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navLinks.map((item, index) => {
              // Render a divider
              if (item.type === "divider") {
                return (
                  <li
                    key="divider"
                    className="pt-4 mt-4 border-t border-gray-700"
                  />
                );
              }

              // Content for the link (icon and text)
              const linkContent = (
                <>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="ms-3 flex-1">{item.label}</span>
                </>
              );

              // Render a normal <Link> for "Back to Site"
              if (item.isLink) {
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={linkClass}
                      onClick={handleLinkClick}
                    >
                      {linkContent}
                    </Link>
                  </li>
                );
              }

              // Render a <NavLink> for all other items
              return (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `${linkClass} ${isActive ? activeLinkClass : ""}`
                    }
                    onClick={handleLinkClick}
                  >
                    {linkContent}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
