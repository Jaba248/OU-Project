import { gql } from "@apollo/client";

export const GET_ALL_CLIENTS = gql`
  query GetAllClients {
    allClients {
      id
      name
      email
    }
  }
`;

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    allProjects {
      id
      name
      startDate
      client {
        id
        name
        email
      }
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: Int!) {
    projectById(id: $id) {
      id
      name
      description
      startDate
      client {
        id
        name
      }
      tasks {
        id
        title
        isCompleted
      }
    }
  }
`;
