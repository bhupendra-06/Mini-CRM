import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProjectForm from "./ProjectForm";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const userRole = localStorage.getItem("role"); // 'admin', 'staff', 'client'
  
  // Helper to decode JWT
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  // In your component
  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);  
  const userId = decoded?.id;
  console.log(userId);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/projects`, {
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
  }, []);

  const handleDelete = async (id) => {
    try {
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
    }
  };

  const handleProgressUpdate = async (id, progress) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress }),
      });
      if (!res.ok) throw new Error("Failed to update progress");
      const updated = await res.json();
      setProjects(projects.map((p) => (p._id === id ? updated : p)));
      toast.success("Progress updated");
    } catch (err) {
      console.error(err);
      toast.error("Error updating progress");
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
                // Only show project if admin, or staff assigned to project, or client of project
                const isStaffAssigned =
                  p.staff && userRole === "staff" && p.staff._id === userId;
                const isClientAssigned =
                  p.client && userRole === "client" && p.client._id === userId;
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
                      {canEdit && (
                        <>
                          <button
                            onClick={() => {
                              const newProgress = prompt(
                                "Enter new progress",
                                p.progress
                              );
                              if (newProgress)
                                handleProgressUpdate(p._id, newProgress);
                            }}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-600 transition"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <ProjectForm />
    </div>
  );
}
