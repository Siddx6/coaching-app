import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Plus, Layers } from "lucide-react";

function Batches() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subCourse: "", name: "", monthlyFee: "", oneTimeFee: "" });
  const [error, setError] = useState("");

  const loadBatches = () => {
    setLoading(true);
    api
      .get("/batches")
      .then((res) => setBatches(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBatches();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/batches", form);
      setForm({ subCourse: "", name: "", monthlyFee: "", oneTimeFee: "" });
      setShowForm(false);
      loadBatches();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add batch");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-sm text-gray-400">{batches.length} active batches</p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16} />
            Add Batch
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
            <label className="block text-sm font-medium text-gray-500 mb-1.5">SubCourse ID</label>
            <input
              name="subCourse"
              value={form.subCourse}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Batch Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Monthly Fee</label>
              <input
                name="monthlyFee"
                value={form.monthlyFee}
                onChange={handleChange}
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">One-Time Fee</label>
              <input
                name="oneTimeFee"
                value={form.oneTimeFee}
                onChange={handleChange}
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Add Batch
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : batches.length === 0 ? (
        <p className="text-gray-400">No batches found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Layers size={18} className="text-gray-700" />
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    b.status === "live" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <p className="font-semibold text-gray-900">{b.name}</p>
              <p className="text-sm text-gray-400 mt-1">
                ₹{b.monthlyFee}/mo &middot; ₹{b.oneTimeFee} one-time
              </p>
              <p className="text-xs text-gray-300 mt-3 truncate">{b._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Batches;