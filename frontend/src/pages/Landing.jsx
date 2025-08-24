import React from "react";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">Freelancer Project Management</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your all-in-one solution for managing projects, clients, and invoices.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
