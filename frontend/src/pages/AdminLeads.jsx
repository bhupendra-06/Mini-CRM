import { useEffect, useState } from "react";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://mini-crm-9gdb.onrender.com/api/leads",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6">
        Leads List
      </h1>

      {loading ? (
        <p className="text-gray-500 text-base sm:text-lg">Loading leads...</p>
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
