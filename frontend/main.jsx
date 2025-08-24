import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Apollo Graphql imports
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { AuthProvider } from "./context/AuthContext.jsx";

// Create link to connect to our backend api
const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql",
});

// Add jwt token when the link is initiated, so it is attached to every call
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem("authToken");
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

// Create the final Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>
);
