import React, { useState } from "react"; // <-- Import useState
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { FaBars } from "react-icons/fa"; // <-- Import the hamburger icon

const AdminLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // <-- State to manage sidebar

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Pass the state and setter function to the Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          {/* --- Hamburger Button (Mobile Only) --- */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 focus:outline-none md:hidden"
            aria-label="Open sidebar"
          >
            <FaBars size={24} />
          </button>

          <h1 className="text-xl font-semibold md:ml-0 ml-4">Admin Panel</h1>
          <div className="text-sm">
            Logged in as:{" "}
            <span className="font-bold text-green-600">{user?.username}</span>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
