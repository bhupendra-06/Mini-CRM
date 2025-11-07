import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // optional for notifications

export default function AdminStaff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL; // your backend URL

useEffect(() => {
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/users/staff`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch staff users");

      const data = await res.json();
      console.log("Fetched staff users:", data);
      setUsers(data);
      toast.success("Staff loaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching staff users");
    } finally {
      setLoading(false);
    }
  };

  fetchStaff();
}, []);


  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading staff...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6">Staff Members</h1>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-left text-gray-700">
          <thead className="bg-yellow-100">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4">{u.role}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No staff members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
