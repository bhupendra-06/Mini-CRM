import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminStaff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch all staff users
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
        setUsers(data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching staff users");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [API_BASE]);

  // Handle Edit button → open modal
  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Handle Delete button
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this staff?"
    );
    if (!confirmDelete) return;

    setDeletingId(id); // mark which one is deleting
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/users/staff/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete staff");

      toast.success("Staff deleted successfully!");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Error deleting staff");
    } finally {
      setDeletingId(null); // reset after delete done
    }
  };

  // Handle update (from modal form)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/users/staff/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: selectedUser.name,
            email: selectedUser.email,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update staff");

      const updated = await res.json();
      toast.success("Staff updated successfully!");

      // Update UI
      setUsers((prev) =>
        prev.map((u) => (u._id === updated.user._id ? updated.user : u))
      );

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error updating staff");
    } finally {
      setUpdating(false);
    }
  };

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
                <td className="py-3 px-4 capitalize">{u.role}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEdit(u)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    disabled={deletingId === u._id}
                    className={`${
                      deletingId === u._id
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white px-3 py-1 rounded text-sm`}
                  >
                    {deletingId === u._id ? "Deleting..." : "Delete"}
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

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">
              Edit Staff
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
