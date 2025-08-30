import React from "react";

const TaskList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-gray-500">
        No tasks have been added to this project yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.isCompleted}
              readOnly
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span
              className={`ml-3 text-lg ${
                task.isCompleted
                  ? "line-through text-gray-500"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className="space-x-2">
            <button className="text-sm text-red-600 hover:text-red-900">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
