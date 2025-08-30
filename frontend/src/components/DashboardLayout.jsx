import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to landing page after logout
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Freelancer PMS
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <Link
            to="/dashboard/projects"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Projects
          </Link>
          <Link
            to="/dashboard/clients"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Clients
          </Link>
          {/* Tasks to be added later */}
          <a
            href="#"
            className="block px-4 py-2 rounded text-gray-500 cursor-not-allowed"
          >
            Tasks (Future)
          </a>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <a
            href="#"
            className="block px-4 py-2 rounded text-gray-500 cursor-not-allowed"
          >
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Page Body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4">
          {/* Top Navbar for quick actions */}
          <div className="text-right">Welcome, User!</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
