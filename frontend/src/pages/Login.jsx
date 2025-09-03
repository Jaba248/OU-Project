import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login: authLogin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: (data) => {
      const token = data.tokenAuth.token;
      authLogin(token); // store token
      navigate("/dashboard/"); // Redirect to dashboard on successful login
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
  };
  if (isLoggedIn) {
    return <Navigate to="/dashboard/" />;
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <p className="mt-4 text-red-500 text-center">
            Error: {error.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
