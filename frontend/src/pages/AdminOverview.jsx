import React, { useState, useEffect } from "react";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    leads: 0,
    clients: 0,
    projects: 0,
    staff: 0,
  });
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/stats`);
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Recent activity (still static for now)
  const [recentActivity] = useState([
    { id: 1, name: "John Doe", type: "Lead", date: "05-Nov-2025", status: "New", color: "green" },
    { id: 2, name: "Acme Corp", type: "Client", date: "04-Nov-2025", status: "Active", color: "blue" },
  ]);

  // Shimmer for stat cards
  const ShimmerCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-gray-300 animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-20 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-16"></div>
    </div>
  );

  // Shimmer for table rows
  const ShimmerRow = () => (
    <tr className="border-b animate-pulse">
      <td className="py-2">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="py-2">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="py-2">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </td>
      <td className="py-2">
        <div className="h-4 bg-gray-300 rounded w-12"></div>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 p-8 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => <ShimmerCard key={i} />)
        ) : (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
              <h3 className="text-gray-500 text-sm">Leads</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.leads}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
              <h3 className="text-gray-500 text-sm">Clients</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.clients}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500">
              <h3 className="text-gray-500 text-sm">Projects</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.projects}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-500">
              <h3 className="text-gray-500 text-sm">Staff</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.staff}</p>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
        <h3 className="text-gray-700 font-semibold mb-4">Recent Activity</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Type</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(4).fill(0).map((_, i) => <ShimmerRow key={i} />)
              : recentActivity.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-100">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.type}</td>
                    <td className="py-2">{item.date}</td>
                    <td
                      className={`py-2 font-semibold ${
                        item.color === "green"
                          ? "text-green-500"
                          : item.color === "blue"
                          ? "text-blue-500"
                          : "text-gray-700"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
