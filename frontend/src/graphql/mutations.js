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
