import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

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
      // case "staff":
      //   return [{ path: "projects", label: "Projects" }];
      // case "client":
      //   return [{ path: "projects", label: "Projects" }];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for desktop & mobile */}
      <div
        className={`fixed md:static top-0 left-0 min-h-screen w-64 bg-[#1E293B] text-white transform transition-transform duration-300 z-50 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-700 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold uppercase">
            {name ? name[0] : "U"}
          </div>
          <h2 className="mt-3 text-lg font-semibold">{name || "User"}</h2>
          <p className="text-sm text-gray-300 truncate">
            {email || "No Email"}
          </p>
          <p className="text-xs text-gray-400 mt-1 capitalize">({role})</p>
        </div>
        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
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
            className="w-full px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition flex items-center justify-center gap-2"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto relative">
        {/* Top Bar for mobile */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 shadow">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 text-2xl"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold uppercase">
            {name ? name[0] : "U"}
          </div>
        </div>

        {/* Content Outlet */}
        <div className="p-4 md:p-6">
          <div className="bg-white shadow-md rounded-xl p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
