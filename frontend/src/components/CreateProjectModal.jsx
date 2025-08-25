import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { GET_ALL_PROJECTS, GET_ALL_CLIENTS } from "../graphql/queries";
import {
  CREATE_CLIENT_MUTATION,
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
} from "../graphql/mutations";

const CreateProjectModal = ({ isOpen, onClose, clients, projectToEdit }) => {
  // Check if we are in edit mode
  const isEditMode = !!projectToEdit;
  // Project form state
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [clientId, setClientId] = useState("");

  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  // UseEffect to prefill form on edit mode
  useEffect(() => {
    if (isEditMode && projectToEdit) {
      setName(projectToEdit.name);
      setStartDate(projectToEdit.startDate);
      setClientId(projectToEdit.client.id);
    } else {
      // Reset form when opening in create mode
      setName("");
      setStartDate("");
      setClientId("");
    }
  }, [projectToEdit, isEditMode, isOpen]);
  // Mutation for creating a project
  const [createProject, { loading: createLoading, error: createError }] =
    useMutation(CREATE_PROJECT_MUTATION, {
      refetchQueries: [{ query: GET_ALL_PROJECTS }],
      onCompleted: onClose,
    });

  // Mutation for editing a project
  const [updateProject, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_PROJECT_MUTATION, {
      refetchQueries: [{ query: GET_ALL_PROJECTS }],
      onCompleted: onClose,
    });

  const [createClient, { loading: clientLoading, error: clientError }] =
    useMutation(CREATE_CLIENT_MUTATION, {
      refetchQueries: [{ query: GET_ALL_CLIENTS }], // Refetch clients so the dropdown updates
      onCompleted: () => {
        // After creating a client, hide the form
        setShowAddClient(false);
        setNewClientName("");
        setNewClientEmail("");
      },
    });

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (!clientId) {
      alert("Please select a client.");
      return;
    }
    const variables = { name, startDate, clientId };
    if (isEditMode) {
      updateProject({ variables: { id: projectToEdit.id, ...variables } });
    } else {
      createProject({ variables });
    }
  };

  // Handle new client form
  const handleClientSubmit = (e) => {
    e.preventDefault();
    createClient({ variables: { name: newClientName, email: newClientEmail } });
  };

  if (!isOpen) return null;
  const loading = createLoading || updateLoading;
  const error = createError || updateError;
  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold mb-4">
          {isEditMode ? "Edit Project" : "Create New Project"}
        </h3>
        <form onSubmit={handleProjectSubmit}>
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

          {/* === CLIENT CREATION UI === */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <label className="block text-gray-700">Client</label>
              {/* Hide add client button when form is active, or is edit mode */}
              {!showAddClient && !isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowAddClient(true)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  + Add New Client
                </button>
              )}
            </div>

            {!showAddClient ? (
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 border rounded mt-1"
                required
                disabled={isEditMode} // Disable on edit mode, is clients cant be changed has to be deleted
              >
                <option value="" disabled>
                  Select a client
                </option>
                {clients?.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 mt-2 border rounded bg-gray-50">
                <input
                  type="text"
                  placeholder="New Client Name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-2"
                  required
                />
                <input
                  type="email"
                  placeholder="New Client Email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddClient(false)}
                    className="text-sm text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleClientSubmit}
                    disabled={clientLoading}
                    className="text-sm px-3 py-1 bg-green-500 text-white rounded"
                  >
                    {clientLoading ? "Saving..." : "Save Client"}
                  </button>
                </div>
                {clientError && (
                  <p className="mt-2 text-red-500 text-xs">
                    Error: {clientError.message}
                  </p>
                )}
              </div>
            )}
          </div>
          {/* === END CLIENT CREATION UI === */}

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
              {loading
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Project"}
            </button>
          </div>
          {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
