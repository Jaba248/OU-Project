import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingLayout = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="font-sans">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            <Link to="/">Freelancer PMS</Link>
          </div>
          <div className="space-x-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard/"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>
        {/* Router will render the inner content in the Outlet Component*/}
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;
