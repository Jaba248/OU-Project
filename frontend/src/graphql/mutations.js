import { gql } from "@apollo/client";

export const CREATE_CLIENT_MUTATION = gql`
  mutation CreateClient($name: String!, $email: String!) {
    createClient(name: $name, email: $email) {
      client {
        id
        name
      }
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
  mutation UpdateProject($id: ID!, $name: String, $startDate: Date) {
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
