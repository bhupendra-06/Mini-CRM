import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

export default function AdminDashboard() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    setRole(storedRole);
    setName(storedName);
    setEmail(storedEmail);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Role-based menu
  const getMenuItems = () => {
    switch (role) {
      case "admin":
        return [
          { path: "overview", label: "Overview" },
          { path: "leads", label: "Leads" },
          { path: "clients", label: "Clients" },
          { path: "projects", label: "Projects" },
          { path: "staff", label: "Staff" },
        ];
      case "staff":
        return [{ path: "projects", label: "Projects" }];
      case "client":
        return [{ path: "projects", label: "Projects" }];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 max-h-screen bg-[#1E293B] text-white hidden md:flex flex-col">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-700 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold uppercase">
            {name ? name[0] : "U"}
          </div>
          <h2 className="mt-3 text-lg font-semibold">{name || "User"}</h2>
          <p className="text-sm text-gray-300 truncate">{email || "No Email"}</p>
          <p className="text-xs text-gray-400 mt-1 capitalize">({role})</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-3 rounded-md cursor-pointer hover:bg-blue-600 mb-2"
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
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
        <div className="bg-white shadow-md rounded-xl p-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
