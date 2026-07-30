import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Plus, Trash2 } from "lucide-react";

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
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
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">Only Admins can manage users.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-400">{users.length} team members</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 max-w-lg space-y-4"
        >
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Add User
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {users.map((u, i) => (
            <div
              key={u._id}
              className={`flex flex-wrap items-center justify-between gap-2 px-6 py-4 ${
                i !== users.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                  {u.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400">
                    {u.email} &middot; {u.mobile}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    u.role === "admin" ? "bg-indigo-50 text-indigo-700" : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {u.role}
                </span>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-gray-300 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
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