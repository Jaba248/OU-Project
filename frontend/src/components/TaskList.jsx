import React from "react";
import { useMutation } from "@apollo/client";
import {
  UPDATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
} from "../graphql/mutations";
import { GET_PROJECT_BY_ID } from "../graphql/queries";

const TaskList = ({ tasks, projectId, onEdit }) => {
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
    refetchQueries: [
      { query: GET_PROJECT_BY_ID, variables: { id: parseInt(projectId) } },
    ],
  });
  const [deleteTask, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_TASK_MUTATION, {
      refetchQueries: [
        { query: GET_PROJECT_BY_ID, variables: { id: parseInt(projectId) } },
      ],
    });
  // Handle Tickbox and update on server side
  const handleStatusChange = (task) => {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    updateTask({ variables: { id: task.id, status: newStatus } });
  };

  // Delete Handle
  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask({ variables: { id: taskId } });
    }
  };
  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-gray-500">
        No tasks have been added to this project yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error during deleting task */}
      {deleteError && (
        <p className="text-red-500">
          Error deleting task: {deleteError.message}
        </p>
      )}

      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.status === "COMPLETED"}
              onChange={() => handleStatusChange(task)}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div className="ml-4">
              <span
                className={`text-lg ${
                  task.status === "COMPLETED"
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </span>
              {task.dueDate && (
                <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                task.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.status.replace("_", " ")}
            </span>
            <button
              onClick={() => onEdit(task)}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
            <button
              className="text-sm text-red-600 hover:text-red-900"
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
