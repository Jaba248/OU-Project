import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK_MUTATION } from "../graphql/mutations";
import { GET_PROJECT_BY_ID } from "../graphql/queries";
import toast from "react-hot-toast";
const EditTaskModal = ({ task, isOpen, onClose, projectId }) => {
  // Form field state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Prefill the form with the tasks data when the modal opens
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStartDate(task.startDate || "");
      setDueDate(task.dueDate || "");
    }
  }, [task]);

  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK_MUTATION, {
    refetchQueries: [
      { query: GET_PROJECT_BY_ID, variables: { id: parseInt(projectId) } },
    ],
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: () => {
      toast.success("Task Updated Successfully");
      // Close the modal on success
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask({
      variables: {
        id: task.id,
        title,
        description,
        startDate: startDate || null,
        dueDate: dueDate || null,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold mb-4">Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              rows="3"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              disabled={loading}
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
          {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
