import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
// Page component imports
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import LandingPage from "./pages/Landing";
import DashboardLayout from "./components/DashboardLayout";
import ProjectsPage from "./pages/dashboard/Projects";
import ProjectDetailPage from "./pages/dashboard/ProjectDetail";
import ClientsPage from "./pages/dashboard/Clients";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Dashboard route only allows logged in users */}
          <Route
            path="/dashboard/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* These are the "child" pages that render inside the layout */}
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="clients" element={<ClientsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
