import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK_MUTATION } from "../graphql/mutations";
import { GET_PROJECT_BY_ID } from "../graphql/queries";
import toast from "react-hot-toast";
const CreateTaskForm = ({ projectId }) => {
  // Form Field States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [createTask, { loading, error }] = useMutation(CREATE_TASK_MUTATION, {
    refetchQueries: [
      { query: GET_PROJECT_BY_ID, variables: { id: parseInt(projectId) } },
    ],
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: () => {
      toast.success("Task Created Successfully");
      // Clear data on success
      setTitle("");
      setDescription("");
      setStartDate("");
      setDueDate("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return; // Check if title field is empty
    // Pass  variables to the mutation
    createTask({
      variables: {
        projectId,
        title,
        description,
        startDate: startDate || null,
        dueDate: dueDate || null,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 bg-gray-50 rounded-lg border"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task title..."
        className="w-full px-3 py-2 border rounded-md mb-2"
        required
        disabled={loading}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)"
        className="w-full px-3 py-2 border rounded-md mb-2"
        rows="2"
        disabled={loading}
      />
      <div className="flex items-center flex-wrap  gap-4">
        <div className="flex flex-col text-left gap-2">
          <label htmlFor="startDate" className="text-sm text-gray-600">
            Start:
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col text-left gap-2">
          <label htmlFor="dueDate" className="text-sm text-gray-600">
            Due:
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 max-md:w-full bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
    </form>
  );
};

export default CreateTaskForm;
