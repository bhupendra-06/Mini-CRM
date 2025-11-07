import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [convertingId, setConvertingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingLead, setEditingLead] = useState(null); // for edit modal
  const [saving, setSaving] = useState(false); // saving state for edit
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/leads`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch leads");

        const data = await response.json();
        setLeads(data);
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Unable to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // ✅ Convert Lead → Client
  const convertToClient = async (id) => {
    try {
      setConvertingId(id);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/clients/convert/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Conversion failed");

      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
      toast.success("Lead converted to client successfully!");
    } catch (err) {
      console.error("Error converting lead:", err);
      toast.error("Failed to convert lead.");
    } finally {
      setConvertingId(null);
    }
  };

  // ✅ Delete Lead
  const deleteLead = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/leads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete lead");

      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
      toast.success("Lead deleted successfully!");
    } catch (err) {
      console.error("Error deleting lead:", err);
      toast.error("Failed to delete lead.");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Save Edited Lead
  const saveEditedLead = async () => {
    if (!editingLead) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/api/leads/${editingLead._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingLead.name,
          email: editingLead.email,
          contact: editingLead.contact,
          status: editingLead.status,
        }),
      });

      if (!response.ok) throw new Error("Failed to update lead");

      const updatedLead = await response.json();
      setLeads((prev) =>
        prev.map((l) => (l._id === updatedLead._id ? updatedLead : l))
      );

      toast.success("Lead updated successfully!");
      setEditingLead(null);
    } catch (err) {
      console.error("Error updating lead:", err);
      toast.error("Failed to update lead.");
    } finally {
      setSaving(false);
    }
  };

  const ShimmerRow = () => (
    <tr className="border-b animate-pulse">
      {[1, 2, 3, 4].map((_, i) => (
        <td key={i} className="py-2 px-3 sm:py-3 sm:px-4">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </td>
      ))}
      <td className="py-2 px-3 sm:py-3 sm:px-4 flex gap-2">
        <div className="h-6 bg-gray-300 rounded w-12"></div>
        <div className="h-6 bg-gray-300 rounded w-12"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <Toaster />
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 mb-6">
        Leads List
      </h1>

      {loading ? (
        <div className="bg-white sm:rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 bg-white rounded-xl shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Name</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Email</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Phone</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Status</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Actions</th>
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
      ) : error ? (
        <p className="text-red-500 text-base sm:text-lg">{error}</p>
      ) : leads.length === 0 ? (
        <p className="text-gray-500 text-base sm:text-lg">No leads found.</p>
      ) : (
        <div className="bg-white sm:rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-3 sm:py-3 sm:px-4 min-w-36">Name</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Email</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Phone</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Status</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 min-w-52 md:min-w-72">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-2 px-3 sm:py-3 sm:px-4">{lead.name}</td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4">{lead.email}</td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4">{lead.contact}</td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        lead.status === "new"
                          ? "bg-yellow-100 text-yellow-800"
                          : lead.status === "converted"
                          ? "bg-green-100 text-green-800"
                          : lead.status === "pending"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => convertToClient(lead.email)}
                      disabled={convertingId === lead._id}
                      className={`bg-blue-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-600 transition ${
                        convertingId === lead._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {convertingId === lead._id ? "Converting..." : "Convert"}
                    </button>

                    <button
                      onClick={() => setEditingLead(lead)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteLead(lead._id)}
                      disabled={deletingId === lead._id}
                      className={`bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition ${
                        deletingId === lead._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {deletingId === lead._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Edit Lead
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                placeholder="Name"
                value={editingLead.name}
                onChange={(e) =>
                  setEditingLead({ ...editingLead, name: e.target.value })
                }
              />
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                placeholder="Email"
                value={editingLead.email}
                onChange={(e) =>
                  setEditingLead({ ...editingLead, email: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                placeholder="Contact"
                value={editingLead.contact}
                onChange={(e) =>
                  setEditingLead({ ...editingLead, contact: e.target.value })
                }
              />
              <select
                className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                value={editingLead.status}
                onChange={(e) =>
                  setEditingLead({ ...editingLead, status: e.target.value })
                }
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditingLead(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedLead}
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${
                  saving
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
