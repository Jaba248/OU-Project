import React, { useState } from "react";
import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { WHO_AM_I } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { Toaster } from "react-hot-toast";
// A basic hamburger icon
const MenuIcon = (props) => (
  <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
);
// Taken from bootstrap icons
const LogoutIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
    />
    <path
      fillRule="evenodd"
      d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
    />
  </svg>
);

const DashboardLayout = () => {
  // Track if navbar is collapsed or not
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to landing page after logout
  };
  // Use the below function to dismiss the navbar when the links are clicked on mobile
  const handleNavClick = () => {
    setIsSidebarOpen(false);
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
      <Toaster />
      {/* Sidebar */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        //  Visiblity is used to allow for animations
        className={`fixed dashboard__sidebar__background ${
          isSidebarOpen ? "opacity-50 visible" : "opacity-0 invisible"
        } max-md:block hidden cursor-pointer max-md:bg-black size-full`}
      ></div>
      <div
        className={`${
          !isSidebarOpen ? "max-md:-translate-x-full" : "max-md:translate-x-0"
        } max-md:fixed max-md h-full w-64 bg-gray-800 text-white flex dashboard__sidebar flex-col`}
      >
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Freelancer PMS
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavLink
            onClick={handleNavClick}
            end
            to="/dashboard/"
            className={navLinkClassName}
          >
            Overview
          </NavLink>
          <NavLink
            onClick={handleNavClick}
            to="/dashboard/projects"
            className={navLinkClassName}
          >
            Projects
          </NavLink>
          <NavLink
            onClick={handleNavClick}
            to="/dashboard/clients"
            className={navLinkClassName}
          >
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
          <NavLink
            onClick={handleNavClick}
            to="/dashboard/settings"
            className={navLinkClassName}
          >
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
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          {/* Left Side: Hamburger on mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-gray-600 focus:outline-none"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Center: Title on mobile */}
          <div className="text-xl mx-auto font-bold md:hidden">
            Freelancer PMS
          </div>

          {/* Right Side: Welcome message on desktop */}
          <div className="md:flex items-center space-x-4 md:ml-auto">
            <div className="text-right hidden md:block text-gray-700">
              {loading
                ? "Loading..."
                : `Welcome, ${data?.whoAmI?.firstName || "User"}`}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              <span className="hidden">Logout</span>
              <span>
                <LogoutIcon />
              </span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 md:p-8 py-4 px-2">
          <Outlet />
          {/* Will be used by the parent route to attach the correct page content */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
