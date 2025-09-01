import React from "react";
import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { WHO_AM_I } from "../graphql/queries";
import { useQuery } from "@apollo/client";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to landing page after logout
  };

  // Function to match the links to active page
  const navLinkClassName = ({ isActive }) => {
    return `block px-4 py-2 rounded hover:bg-gray-700 hover:scale-104 ${
      isActive ? "bg-gray-700" : ""
    }`;
  };
  // Who Am I Query
  const { data, loading } = useQuery(WHO_AM_I);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Freelancer PMS
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavLink end to="/dashboard/" className={navLinkClassName}>
            Overview
          </NavLink>
          <NavLink to="/dashboard/projects" className={navLinkClassName}>
            Projects
          </NavLink>
          <NavLink to="/dashboard/clients" className={navLinkClassName}>
            Clients
          </NavLink>
          {/* Tasks to be added later */}
          <a
            href="#"
            className="block px-4 py-2 rounded text-gray-500 cursor-not-allowed"
          >
            Tasks (Future)
          </a>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <NavLink to="/dashboard/settings" className={navLinkClassName}>
            Settings
          </NavLink>
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
        <header className="bg-white shadow-md p-4 flex justify-end items-center">
          <div className="text-right">
            {loading
              ? "Loading..."
              : `Welcome, ${data?.whoAmI?.firstName || "User"}`}
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
          {/* Will be used by the parent route to attach the correct page content */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
