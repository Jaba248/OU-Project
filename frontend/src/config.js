// Decide the GraphQL endpoint based on the environment.
export const API_URL = import.meta.env.PROD
  ? "/graphql" // production: same-origin via Nginx proxy
  : import.meta.env.VITE_API_URL ?? "http://localhost:8000/graphql"; // dev: Django runserver
