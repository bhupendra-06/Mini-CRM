import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProjectForm({ onClose }) {
  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [clients, setClients] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // loading state for submit

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    client: "",
    staff: "", // single staff
    progress: "not started",
  });

  // Fetch clients and staff
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [clientsRes, staffRes] = await Promise.all([
          fetch(`${API_BASE}/api/users/clients`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),
          fetch(`${API_BASE}/api/users/staff`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),
        ]);

        setClients(clientsRes);
        setStaffs(staffRes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API_BASE, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // start loading
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        clientId: formData.client,
        staffIds: formData.staff ? [formData.staff] : [],
        progress: formData.progress,
      };

      const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create project");

      toast.success("Project created successfully!");
      setFormData({
        title: "",
        description: "",
        deadline: "",
        client: "",
        staff: "",
        progress: "not started",
      });
      if (onClose) onClose(); // close modal if function passed
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create project");
    } finally {
      setSubmitting(false); // stop loading
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Client</label>
          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Staff</label>
          <select
            name="staff"
            value={formData.staff}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select staff</option>
            {staffs.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Progress</label>
          <select
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded text-white transition ${
            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
