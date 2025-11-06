import { useEffect, useState } from "react";

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://mini-crm-9gdb.onrender.com/api/clients",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]); // ensure empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6">
        Clients List
      </h1>
      {loading ? (
        <p className="text-gray-500 text-base sm:text-lg">Loading clients...</p>
      ) : clients.length === 0 ? (
        <p className="text-gray-500 text-base sm:text-lg">No clients found.</p>
      ) : (
        <div className="bg-white sm:rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 bg-white rounded-xl shadow-md">
            <thead className="bg-green-100">
              <tr>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Company
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Contact
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Email
                </th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
                    {c.name}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
                    {c.contact}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base">
                    {c.email}
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
