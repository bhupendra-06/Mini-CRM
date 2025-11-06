export default function AdminStaff() {
  const users = [
    { id: 1, name: "Ravi Kumar", role: "Staff", email: "ravi@crm.com" },
    { id: 2, name: "Neha Gupta", role: "Staff", email: "neha@crm.com" },
  ];

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
              <tr key={u.id} className="border-b hover:bg-gray-50">
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
