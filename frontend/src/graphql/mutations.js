import { gql } from "@apollo/client";

export const CREATE_CLIENT_MUTATION = gql`
  mutation CreateClient($name: String!, $email: String!) {
    createClient(name: $name, email: $email) {
      client {
        id
        name
        email
      }
    }
  }
`;
export const DELETE_CLIENT_MUTATION = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      ok
    }
  }
`;
// Project Mutations
export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($name: String!, $startDate: Date!, $clientId: ID!) {
    createProject(name: $name, startDate: $startDate, clientId: $clientId) {
      project {
        id
        name
      }
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: ID!, $name: String, $startDate: Date!) {
    updateProject(id: $id, name: $name, startDate: $startDate) {
      project {
        id
        name
        startDate
      }
    }
  }
`;
export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      ok
    }
  }
`;
// End Project Mutations

// Task Mutations
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $startDate: Date
    $dueDate: Date
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      startDate: $startDate
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        dueDate
        status
      }
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: String
    $startDate: Date
    $dueDate: Date
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      startDate: $startDate
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        startDate
        dueDate
      }
    }
  }
`;
// End task Mutations
