import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_ALL_CLIENTS } from "../graphql/queries";
import { CREATE_CLIENT_MUTATION } from "../graphql/mutations";
import toast from "react-hot-toast";
const CreateClientModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [createClient, { loading, error }] = useMutation(
    CREATE_CLIENT_MUTATION,
    {
      refetchQueries: [{ query: GET_ALL_CLIENTS }], // Used to refresh list
      onError: (error) => {
        toast.error(error.message);
      },
      onCompleted: () => {
        toast.success("Client Created Successfully");
        onClose(); // Used to close modal
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createClient({ variables: { name, email } });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold mb-4">Create New Client</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Client Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Client Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {loading ? "Saving..." : "Save Client"}
            </button>
          </div>
          {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateClientModal;
