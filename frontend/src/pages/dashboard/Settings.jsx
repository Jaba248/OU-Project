import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { WHO_AM_I } from "../../graphql/queries";
import { CHANGE_PASSWORD_MUTATION } from "../../graphql/mutations";

const Settings = () => {
  const { data, loading, error } = useQuery(WHO_AM_I);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [
    changePassword,
    { loading: changePasswordLoading, error: changePasswordError },
  ] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: () => {
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
  });

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    changePassword({ variables: { oldPassword, newPassword } });
  };

  if (loading) return <p className="p-8">Loading settings...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error.message}</p>;

  const user = data.whoAmI;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <div className="space-y-2">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
      {/* End Profile Section */}
      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-gray-700">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={changePasswordLoading}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {changePasswordLoading ? "Saving..." : "Change Password"}
          </button>
          {changePasswordError && (
            <p className="mt-2 text-red-500">
              Error: {changePasswordError.message}
            </p>
          )}
        </form>
      </div>
      {/* End Change Password section */}
    </>
  );
};

export default Settings;
