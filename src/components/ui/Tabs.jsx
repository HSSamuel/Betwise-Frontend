import React from "react";

/**
 * A reusable tabs component for navigation.
 * @param {Array} tabs - An array of tab objects, e.g., [{ name: 'upcoming', label: 'Upcoming' }]
 * @param {string} activeTab - The name of the currently active tab.
 * @param {Function} onTabClick - A function to call when a tab is clicked.
 */
const Tabs = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabClick(tab.name)}
            className={`
              whitespace-nowrap py-3 px-4 font-semibold text-sm rounded-t-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${
                activeTab === tab.name
                  ? "border-gray-200 border-b-transparent bg-white dark:bg-gray-900 dark:border-gray-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
              }
            `}
            aria-current={activeTab === tab.name ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
