import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLeads from "./pages/AdminLeads";
import AdminClients from "./pages/AdminClients";
import AdminProjects from "./pages/AdminProjects";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminStaff from "./pages/AdminStaff";
import AdminOverview from "./pages/AdminOverview";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Dashboard layout with nested routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" />} />
        {/* <Route path="dashboard" element={<div>Dashboard Content</div>} /> */}
        <Route path="overview" element={<AdminOverview />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="staff" element={<AdminStaff />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
