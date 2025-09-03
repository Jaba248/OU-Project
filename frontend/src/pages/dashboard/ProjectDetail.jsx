import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROJECT_BY_ID } from "../../graphql/queries";
import { CREATE_STRIPE_INVOICE_MUTATION } from "../../graphql/mutations";
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
  // Invoice Mutation
  const [
    createInvoice,
    { loading: invoiceLoading, error: invoiceError, createInvoiceClient },
  ] = useMutation(CREATE_STRIPE_INVOICE_MUTATION, {
    // Ensures that the ui is updated by pulling the fresh data regarding the invoice
    refetchQueries: [
      {
        query: GET_PROJECT_BY_ID,
        variables: { id: parseInt(id) },
      },
    ],
    onCompleted: (data) => {
      // Open the Stripe invoice page in a new tab on success
      if (data.createStripeInvoice.invoiceUrl) {
        window.open(data.createStripeInvoice.invoiceUrl, "_blank");
      }
    },
    onError: (error) => {
      alert(`Failed to create invoice: ${error.message}`);
      // Refetch does it run on error, so to ensure the buttons and text are updated when a, invoice already paid error is raised we force a refetch.
      createInvoiceClient.refetchQueries({
        include: [
          {
            query: GET_PROJECT_BY_ID,
            variables: { id: parseInt(id) },
          },
        ],
      });
    },
  });
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
      <>
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
          <div className="mt-6 border-t pt-4">
            <div className="flex">
              {!project?.invoice?.isPaid && (
                <button
                  onClick={() =>
                    createInvoice({ variables: { projectId: project.id } })
                  }
                  disabled={invoiceLoading}
                  className="px-4 py-2 bg-purple-600 text-white mr-2 rounded hover:bg-purple-700 transition"
                >
                  {invoiceLoading ? "Generating..." : "Generate Stripe Invoice"}
                </button>
              )}
              {project?.invoice?.stripeInvoiceUrl && (
                <a
                  href={project.invoice.stripeInvoiceUrl}
                  rel="noopener"
                  target="_blank"
                  className="button px-4 py-2 text-white rounded transition bg-green-500 hover:bg-green-600"
                >
                  View Invoice
                </a>
              )}
            </div>
            {project?.invoice?.isPaid && (
              <p className="text-green-500 mt-2">
                Invoice has been paid Successfully
              </p>
            )}
            {invoiceError && (
              <p className="text-red-500 mt-2">Error: {invoiceError.message}</p>
            )}
          </div>
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
      </>
    </>
  );
};

export default ProjectDetails;
