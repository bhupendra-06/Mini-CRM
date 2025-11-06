import { useEffect, useState } from "react";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Shimmer row for table
  const ShimmerRow = () => (
    <tr className="border-b animate-pulse">
      <td className="py-2 px-3 sm:py-3 sm:px-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="py-2 px-3 sm:py-3 sm:px-4">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </td>
      <td className="py-2 px-3 sm:py-3 sm:px-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="py-2 px-3 sm:py-3 sm:px-4">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </td>
      <td className="py-2 px-3 sm:py-3 sm:px-4 flex gap-2">
        <div className="h-6 bg-gray-300 rounded w-12"></div>
        <div className="h-6 bg-gray-300 rounded w-12"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6">
        Leads List
      </h1>

      {loading ? (
        <div className="bg-white sm:rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 bg-white rounded-xl shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Name
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Email
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Phone
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
      ) : leads.length === 0 ? (
        <p className="text-gray-500 text-base sm:text-lg">No leads found.</p>
      ) : (
        <div className="bg-white sm:rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 bg-white rounded-xl shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Name
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Email
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Phone
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
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
                    {lead.name}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
                    {lead.email}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
                    {lead.contact}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base capitalize">
                    {lead.status}
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
