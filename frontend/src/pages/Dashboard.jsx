import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PROJECTS, GET_ALL_CLIENTS } from "../graphql/queries";
import ProjectList from "../components/ProjectList";
import CreateProjectModal from "../components/CreateProjectModal";
import { Link } from "react-router";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    loading: projectsLoading,
    error: projectsError,
    data: projectsData,
  } = useQuery(GET_ALL_PROJECTS);
  const {
    loading: clientsLoading,
    error: clientsError,
    data: clientsData,
  } = useQuery(GET_ALL_CLIENTS);

  if (projectsLoading || clientsLoading)
    return <p className="p-8">Loading...</p>;
  if (projectsError)
    return (
      <>
        <p className="p-8 text-red-500">
          Error fetching projects: {projectsError.message}
        </p>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
      </>
    );
  if (clientsError)
    return (
      <p className="p-8 text-red-500">
        Error fetching clients: {clientsError.message}
      </p>
    );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + New Project
        </button>
      </div>

      <ProjectList projects={projectsData.allProjects} />

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clients={clientsData.allClients}
      />
    </div>
  );
};

export default Dashboard;
