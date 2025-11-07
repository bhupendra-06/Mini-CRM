import React, { useState, useEffect } from "react";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    leads: 0,
    clients: 0,
    projects: 0,
    staff: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    role: "lead",
  });
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/stats`);
        if (!response.ok) throw new Error("Failed to fetch stats");
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

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Failed to add user");

      alert("User added successfully!");
      setShowModal(false);
      setNewUser({ name: "", email: "", contact: "", password: "", role: "lead" });
    } catch (error) {
      console.error(error);
      alert("Error adding user.");
    }
  };

  const ShimmerCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-gray-300 animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-20 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-16"></div>
    </div>
  );

  return (
    <div className="flex-1 p-8 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <ShimmerCard key={i} />)
        ) : (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
              <h3 className="text-gray-500 text-sm">Leads</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.leads}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
              <h3 className="text-gray-500 text-sm">Clients</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.clients}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500">
              <h3 className="text-gray-500 text-sm">Projects</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.projects}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-500">
              <h3 className="text-gray-500 text-sm">Staff</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.staff}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Add New User Card */}
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer bg-white p-6 rounded-xl shadow-md border-2 border-dashed border-gray-300 hover:bg-gray-50 w-full max-w-sm text-center"
      >
        <p className="text-gray-500 font-semibold">+ Add New User</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              Add New User
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={newUser.contact}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="lead">Lead</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
