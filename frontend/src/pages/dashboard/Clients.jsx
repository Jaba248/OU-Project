import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CLIENTS } from "../../graphql/queries";
import { DELETE_CLIENT_MUTATION } from "../../graphql/mutations";
import CreateClientModal from "../../components/CreateClientModal";

const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_ALL_CLIENTS);
  const [deleteClient] = useMutation(DELETE_CLIENT_MUTATION, {
    refetchQueries: [{ query: GET_ALL_CLIENTS }], // Refetch the list after deleting
  });
  const handleDelete = (clientId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this client? This will also delete all their projects."
      )
    ) {
      deleteClient({ variables: { id: clientId } });
    }
  };

  if (loading) return <p className="p-8">Loading clients...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error.message}</p>;

  const clients = data.allClients;

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + New Client
          </button>
        </div>
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients &&
                clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(client.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {clients && clients.length === 0 && (
            <p className="p-4 text-gray-500">No clients found.</p>
          )}
        </div>
      </div>

      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Clients;
