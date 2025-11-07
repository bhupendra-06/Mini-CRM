import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProjectForm from "./ProjectForm";

// Modal component for updating project status
function UpdateStatusModal({ project, onClose, onUpdate }) {
  const [progress, setProgress] = useState(project.progress);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/projects/${project._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress }),
      });
      if (!res.ok) throw new Error("Failed to update project status");
      const updated = await res.json();
      toast.success("Project status updated!");
      onUpdate(updated);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Update Project Status</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Progress</label>
            <select
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="not started">Not Started</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [statusModalProject, setStatusModalProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const userRole = localStorage.getItem("role"); // 'admin', 'staff', 'client'
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let url = "";

        if (userRole === "admin") {
          url = `${API_BASE}/api/projects`;
        } else {
          url = `${API_BASE}/api/projects/user/${userId}`;
        }

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [API_BASE, userRole, userId]);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting project");
    } finally {
      setDeletingId(null);
    }
  };

  const ShimmerRow = () => (
    <tr className="border-b animate-pulse">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <td key={i} className="py-2 px-3 sm:py-3 sm:px-4">
            <div className="h-4 bg-gray-300 rounded w-24 sm:w-32"></div>
          </td>
        ))}
    </tr>
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700 mb-6">
        Projects List
      </h1>

      {userRole === "admin" && (
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Add Project
        </button>
      )}

      {loading ? (
        <div className="bg-white sm:rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 bg-white rounded-xl shadow-md">
            <thead className="bg-indigo-100">
              <tr>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Title</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Client</th>
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
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-base sm:text-lg">No projects found.</p>
      ) : (
        <div className="bg-white sm:rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 bg-white rounded-xl shadow-md">
            <thead className="bg-indigo-100">
              <tr>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Title</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Client</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Status</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const isStaffAssigned =
                  userRole === "staff" &&
                  Array.isArray(p.staff) &&
                  p.staff.some((s) => s?._id?.toString() === userId);
                const isClientAssigned =
                  userRole === "client" && p.client?._id?.toString() === userId;
                const canEdit = userRole === "admin" || isStaffAssigned;

                if (userRole === "staff" && !isStaffAssigned) return null;
                if (userRole === "client" && !isClientAssigned) return null;

                return (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
                      {p.title}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
                      {p.client?.name || "N/A"}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base capitalize">
                      {p.progress}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base flex flex-wrap gap-2">
                      {userRole === "client" ? (
                        <span className="text-gray-500">
                          No actions required
                        </span>
                      ) : canEdit ? (
                        <>
                          <button
                            onClick={() => setStatusModalProject(p)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-600 transition"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            className={`px-3 py-1 rounded text-xs sm:text-sm transition ${
                              deletingId === p._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                          >
                            {deletingId === p._id ? "Deleting..." : "Delete"}
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <ProjectForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {statusModalProject && (
        <UpdateStatusModal
          project={statusModalProject}
          onClose={() => setStatusModalProject(null)}
          onUpdate={(updatedProject) =>
            setProjects((prev) =>
              prev.map((p) =>
                p._id === updatedProject._id ? updatedProject : p
              )
            )
          }
        />
      )}
    </div>
  );
}
