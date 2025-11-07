import { useEffect, useState } from "react";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/projects`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Unable to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Shimmer row component
  const ShimmerRow = () => (
    <tr className="border-b animate-pulse">
      <td className="py-2 px-3 sm:py-3 sm:px-4">
        <div className="h-4 bg-gray-300 rounded w-24 sm:w-32"></div>
      </td>
      <td className="py-2 px-3 sm:py-3 sm:px-4">
        <div className="h-4 bg-gray-300 rounded w-20 sm:w-28"></div>
      </td>
      <td className="py-2 px-3 sm:py-3 sm:px-4">
        <div className="h-4 bg-gray-300 rounded w-16 sm:w-20"></div>
      </td>
      <td className="py-2 px-3 sm:py-3 sm:px-4 flex gap-2">
        <div className="h-6 bg-gray-300 rounded w-12 sm:w-16"></div>
        <div className="h-6 bg-gray-300 rounded w-12 sm:w-16"></div>
      </td>
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
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Title
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Client
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Status
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Actions
                </th>
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
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Title
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Client
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Status
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
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
                    {p.status}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base flex flex-wrap gap-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-600 transition">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
