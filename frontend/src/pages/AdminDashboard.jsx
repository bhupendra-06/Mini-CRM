import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    clients: 0,
    projects: 0,
    staff: 0,
  });

  // Temporary mock data (replace later with API call)
  useEffect(() => {
    // Example fetch from backend later:
    // fetch("http://localhost:5000/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
    //   .then(res => res.json())
    //   .then(data => setStats(data));

    setStats({
      leads: 24,
      clients: 12,
      projects: 8,
      staff: 5,
    });
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md p-6 rounded-xl border-t-4 border-blue-500">
          <h2 className="text-gray-500 text-sm">Total Leads</h2>
          <p className="text-3xl font-semibold text-gray-800">{stats.leads}</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border-t-4 border-green-500">
          <h2 className="text-gray-500 text-sm">Total Clients</h2>
          <p className="text-3xl font-semibold text-gray-800">{stats.clients}</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border-t-4 border-indigo-500">
          <h2 className="text-gray-500 text-sm">Total Projects</h2>
          <p className="text-3xl font-semibold text-gray-800">{stats.projects}</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border-t-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm">Total Staff</h2>
          <p className="text-3xl font-semibold text-gray-800">{stats.staff}</p>
        </div>
      </div>

      {/* Placeholder for future charts or tables */}
      <div className="mt-10 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Recent Activity (Coming Soon)
        </h2>
        <p className="text-gray-500">This section will show recent CRM updates.</p>
      </div>
    </div>
  );
}
