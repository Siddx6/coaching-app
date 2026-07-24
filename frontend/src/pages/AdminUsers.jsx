import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "operator", mobile: "" });
  const [error, setError] = useState("");

  const loadUsers = () => {
    setLoading(true);
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/users", form);
      setForm({ name: "", email: "", password: "", role: "operator", mobile: "" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    loadUsers();
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p className="text-red-600">Only Admins can manage users.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Manage Users</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-lg space-y-3">
        <h2 className="font-semibold text-gray-700">Add Admin / Operator</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className="w-full border rounded px-3 py-2"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="operator">Operator</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Add User
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-3 max-w-2xl">
          {users.map((u) => (
            <div key={u._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">
                  {u.email} &middot; {u.mobile}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {u.role}
                </span>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;