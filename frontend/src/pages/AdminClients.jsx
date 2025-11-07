import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Get all clients
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/clients`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to load clients");
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [API_BASE]);

  // Handle input change inside modal
  const handleChange = (e) => {
    setEditingClient({ ...editingClient, [e.target.name]: e.target.value });
  };

  // Update client details
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingClient) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/clients/${editingClient._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingClient),
        }
      );

      if (!response.ok) throw new Error("Failed to update client");

      toast.success("Client updated successfully");

      // Update the local list
      setClients((prev) =>
        prev.map((c) => (c._id === editingClient._id ? editingClient : c))
      );
      setEditingClient(null);
    } catch (error) {
      toast.error("Error updating client: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧨 Handle Delete
  const handleDelete = async (clientId) => {
    const confirmDelete = confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/clients/${clientId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete client");

      toast.success("Client deleted successfully!");
      setClients((prev) => prev.filter((c) => c._id !== clientId));
    } catch (err) {
      toast.error(err.message || "Error deleting client");
    } finally {
      setLoading(false);
    }
  };

  const ShimmerRow = () => (
    <tr className="border-b animate-pulse">
      <td className="py-2 px-3">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="py-2 px-3">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </td>
      <td className="py-2 px-3">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="py-2 px-3 flex gap-2">
        <div className="h-6 bg-gray-300 rounded w-12"></div>
        <div className="h-6 bg-gray-300 rounded w-12"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <Toaster position="bottom-right" />
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 mb-6">
        Clients List
      </h1>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 bg-white rounded-xl shadow-md">
            <thead className="bg-green-100">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <ShimmerRow key={i} />
                ))}
            </tbody>
          </table>
        </div>
      ) : clients.length === 0 ? (
        <p className="text-gray-500 text-base sm:text-lg">No clients found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 bg-white rounded-xl shadow-md">
            <thead className="bg-green-100">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-3">{c.name}</td>
                  <td className="py-2 px-3">{c.email}</td>
                  <td className="py-2 px-3">{c.contact}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      onClick={() => setEditingClient(c)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🟢 Edit Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Edit Client
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingClient.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingClient.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={editingClient.contact}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
