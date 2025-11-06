import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");

  const stats = {
    leads: 24,
    clients: 12,
    projects: 8,
    staff: 5,
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuItems = [
    { path: "overview", label: "overview" },
    { path: "leads", label: "Leads" },
    { path: "clients", label: "Clients" },
    { path: "projects", label: "Projects" },
    { path: "staff", label: "Staff" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 max-h-screen bg-[#1E293B] text-white hidden md:flex flex-col">
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-3 rounded-md cursor-pointer hover:bg-blue-600 mb-2"
              onClick={() => setSidebarOpen(false)} // close on mobile
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 h-screen overflow-y-auto">
        {active === "dashboard" && (
          <div className="bg-white shadow-md rounded-xl p-1">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}
