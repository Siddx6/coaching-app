/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Plus, Bell, Trash2 } from "lucide-react";

function Notices() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", audience: "all" });
  const [error, setError] = useState("");

  const loadNotices = () => {
    setLoading(true);
    api
      .get("/notices")
      .then((res) => setNotices(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/notices", form);
      setForm({ title: "", message: "", audience: "all" });
      setShowForm(false);
      loadNotices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add notice");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    await api.delete(`/notices/${id}`);
    loadNotices();
  };

  const audienceStyle = {
    all: "bg-indigo-50 text-indigo-700",
    students: "bg-green-50 text-green-700",
    staff: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
          <p className="text-sm text-gray-400">{notices.length} notices posted</p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16} />
            New Notice
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 max-w-lg space-y-4"
        >
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Audience</label>
            <select
              name="audience"
              value={form.audience}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Everyone</option>
              <option value="students">Students Only</option>
              <option value="staff">Staff Only</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Post Notice
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : notices.length === 0 ? (
        <p className="text-gray-400">No notices yet.</p>
      ) : (
        <div className="grid gap-4 max-w-3xl">
          {notices.map((n) => (
            <div key={n._id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Bell size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${audienceStyle[n.audience]}`}
                    >
                      {n.audience}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
                {user?.role === "admin" && (
                  <button onClick={() => handleDelete(n._id)} className="text-gray-300 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notices;