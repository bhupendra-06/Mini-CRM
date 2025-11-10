import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProjectForm from "./ProjectForm";

// ===================== UPDATE STATUS MODAL =====================
function UpdateStatusModal({ project, onClose, onUpdate, refreshProjects }) {
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
      refreshProjects(); // ✅ refresh populated data
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
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Update Project Status</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Progress
          </label>
          <select
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full border p-2 rounded-lg mb-4"
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ===================== MAIN PROJECTS COMPONENT =====================
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusModalProject, setStatusModalProject] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const userRole = localStorage.getItem("role"); // 'admin', 'staff', or 'client'
  const userId = localStorage.getItem("userId");

  // ✅ Fetch all projects based on role
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

  useEffect(() => {
    fetchProjects();
  }, [API_BASE, userRole, userId]);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete project");
      toast.success("Project deleted!");
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // ✅ Shimmer Card
  const ShimmerCard = () => (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  // ✅ Role-based filtering logic
  const visibleProjects = projects.filter((p) => {
    if (userRole === "admin") return true;
    if (userRole === "staff") {
      return Array.isArray(p.staff) && p.staff.some((s) => s?._id === userId);
    }
    if (userRole === "client") {
      return p.client && p.client._id === userId;
    }
    return false;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-indigo-700">Projects</h1>
        {userRole === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Add Project
          </button>
        )}
      </div>

      {/* ✅ Loading shimmer */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <ShimmerCard key={i} />
            ))}
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : visibleProjects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <div
              key={project._id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-indigo-700">
                {project.title}
              </h2>
              <p className="text-gray-600 mb-2">{project.description}</p>

              <p className="text-sm text-gray-500">
                <strong>Client:</strong>{" "}
                {project.client
                  ? `${project.client.name} (${project.client.email})`
                  : "N/A (—)"}
              </p>

              <p className="text-sm text-gray-500">
                <strong>Assigned Staff:</strong>{" "}
                {project.staff && project.staff.length > 0
                  ? project.staff.map((s) => s.name).join(", ")
                  : "—"}
              </p>

              <p className="text-sm text-gray-500 capitalize">
                <strong>Progress:</strong> {project.progress}
              </p>

              <p className="text-sm text-gray-500">
                <strong>Deadline:</strong>{" "}
                {project.deadline
                  ? new Date(project.deadline).toLocaleDateString()
                  : "—"}
              </p>

              {/* ✅ Role-based actions */}
              {userRole === "client" ? (
                <p className="text-gray-500 text-sm mt-2">No actions available</p>
              ) : userRole === "admin" || userRole === "staff" ? (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setStatusModalProject(project)}
                    className="bg-green-500 px-3 py-1 rounded text-white text-sm hover:bg-green-600"
                  >
                    Update
                  </button>
                  {userRole === "admin" && (
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="bg-red-500 px-3 py-1 rounded text-white text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <ProjectForm
              onClose={() => setShowModal(false)}
              refreshProjects={fetchProjects}
            />
          </div>
        </div>
      )}

      {/* ✅ Update Status Modal */}
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
          refreshProjects={fetchProjects}
        />
      )}
    </div>
  );
}
