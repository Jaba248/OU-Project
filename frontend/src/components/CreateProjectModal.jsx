import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { GET_ALL_PROJECTS } from "../graphql/queries";

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($name: String!, $startDate: Date!, $clientId: ID!) {
    createProject(name: $name, startDate: $startDate, clientId: $clientId) {
      project {
        id
        name
      }
    }
  }
`;

const CreateProjectModal = ({ isOpen, onClose, clients }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [clientId, setClientId] = useState("");

  const [createProject, { loading, error }] = useMutation(
    CREATE_PROJECT_MUTATION,
    {
      // This is key: after the mutation, refetch the projects so the list updates automatically!
      refetchQueries: [{ query: GET_ALL_PROJECTS }],
      onCompleted: onClose, // Close the modal on success
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId) {
      alert("Please select a client.");
      return;
    }
    createProject({ variables: { name, startDate, clientId } });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold mb-4">Create New Project</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select a client
              </option>
              {clients?.map(
                (
                  client // Added optional chaining ?. for safety
                ) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                )
              )}
            </select>
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
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
          {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
