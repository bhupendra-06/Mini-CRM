import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 If not logged in
  if (!token) return <Navigate to="/login" />;

  // 🔍 Check if user has permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect based on role
    if (role === "admin") {
      return <Navigate to="/dashboard/overview" />;
    } else {
      return <Navigate to="/dashboard/projects" />;
    }
  }

  return children;
}
