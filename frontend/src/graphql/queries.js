import { gql } from "@apollo/client";

export const GET_ALL_CLIENTS = gql`
  query GetAllClients {
    allClients {
      id
      name
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
      }
    }
  }
`;
