import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLeads from "./pages/AdminLeads";
import AdminClients from "./pages/AdminClients";
import AdminProjects from "./pages/AdminProjects";
import AdminStaff from "./pages/AdminStaff";
import AdminOverview from "./pages/AdminOverview";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff", "client", "lead"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" />} />

        {/* Only admin can access Overview & Leads & Staff */}
        <Route
          path="overview"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="leads"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLeads />
            </ProtectedRoute>
          }
        />
        <Route
          path="staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminStaff />
            </ProtectedRoute>
          }
        />

        {/* Admin & Staff can access Clients */}
        <Route
          path="clients"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminClients />
            </ProtectedRoute>
          }
        />

        {/* Everyone (admin, staff, client or lead) can access Projects */}
        <Route
          path="projects"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "client", "lead"]}>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
