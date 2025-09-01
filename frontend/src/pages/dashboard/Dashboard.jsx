import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_CLIENTS, GET_ALL_PROJECTS } from "../../graphql/queries";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { loading: clientsLoading, data: clientsData } =
    useQuery(GET_ALL_CLIENTS);
  const { loading: projectsLoading, data: projectsData } =
    useQuery(GET_ALL_PROJECTS);
  if (clientsLoading || projectsLoading) {
    return <p className="p-8">Loading dashboard overview...</p>;
  }
  const totalClients = clientsData?.allClients?.length || 0;
  const totalProjects = projectsData?.allProjects?.length || 0;

  // Get the 3 most recent projects
  const recentProjects = projectsData?.allProjects?.slice(-3).reverse() || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Projects
          </h2>
          <p className="text-4xl font-bold text-blue-500">{totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Total Clients</h2>
          <p className="text-4xl font-bold text-green-500">{totalClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Invoices Sent</h2>
          <p className="text-4xl font-bold text-gray-400">0</p>
          <p className="text-xs text-gray-400">(Stripe feature pending)</p>
        </div>
      </div>

      {/* Recent Projects List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <li
                  key={project.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {project.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {project.client.name}
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/projects/${project.id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View
                  </Link>
                </li>
              ))
            ) : (
              <p className="py-3 text-gray-500">No projects created yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
