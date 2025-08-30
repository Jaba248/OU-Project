import React from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_PROJECT_MUTATION } from "../graphql/mutations";
import { GET_ALL_PROJECTS } from "../graphql/queries";

const ProjectList = ({ projects, onEdit }) => {
  const [deleteProject, { loading, error }] = useMutation(
    DELETE_PROJECT_MUTATION,
    {
      refetchQueries: [{ query: GET_ALL_PROJECTS }], // Used to refresh the list after completion
    }
  );
  // Delete Handle Function
  const handleDelete = (projectId) => {
    // Use a  browser confirm dialog before deleting
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject({ variables: { id: projectId } });
    }
  };

  if (!projects || projects.length === 0) {
    return <p>No projects found. Add one to get started!</p>;
  }
  if (loading) return <p>Deleting...</p>;
  if (error) return <p>Error deleting project: {error.message}</p>; // should never be triggered
  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  to={`/dashboard/project/${project.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {project.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {project.client.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {project.startDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  onClick={() => onEdit(project)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => {
                    handleDelete(project.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;
