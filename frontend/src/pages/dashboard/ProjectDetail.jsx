import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PROJECT_BY_ID } from "../../graphql/queries";
import TaskList from "../../components/TaskList";
import CreateTaskForm from "../../components/CreateTaskForm";
import EditTaskModal from "../../components/EditTaskModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: parseInt(id) },
  });
  const [isTaskEditModalOpen, setIsTakEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const handleTaskOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsTakEditModalOpen(true);
  };
  const handleCloseTaskEditModal = () => {
    setTaskToEdit(null);
    setIsTakEditModalOpen(false);
  };

  if (loading) return <div className="p-8">Loading project details...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  const { projectById: project } = data;

  return (
    <>
      <EditTaskModal
        task={taskToEdit}
        isOpen={isTaskEditModalOpen}
        onClose={handleCloseTaskEditModal}
        projectId={project.id}
      />
      <div className="p-8">
        <Link
          to="/dashboard/projects"
          className="text-blue-500 hover:underline mb-6 block"
        >
          &larr; Back to Projects
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-lg text-gray-600">Client: {project.client.name}</p>
          <p className="text-sm text-gray-500">
            Start Date: {project.startDate}
          </p>
          {project.description && (
            <p className="mt-4 text-gray-700">{project.description}</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
          <CreateTaskForm projectId={project.id} />
          <div className="mt-6">
            <TaskList
              tasks={project.tasks}
              projectId={project.id}
              onEdit={handleTaskOpenEditModal}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
