import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Batches() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
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
      loadBatches();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add batch");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Manage Batches</h1>

      {user?.role === "admin" && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-lg space-y-3">
          <h2 className="font-semibold text-gray-700">Add Batch</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input
            name="subCourse"
            value={form.subCourse}
            onChange={handleChange}
            placeholder="SubCourse ID"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Batch Name"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            name="monthlyFee"
            value={form.monthlyFee}
            onChange={handleChange}
            placeholder="Monthly Fee"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="oneTimeFee"
            value={form.oneTimeFee}
            onChange={handleChange}
            placeholder="One-Time Fee"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
            Add Batch
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : batches.length === 0 ? (
        <p className="text-gray-500">No batches found.</p>
      ) : (
        <div className="grid gap-4">
          {batches.map((b) => (
            <div key={b._id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{b.name}</p>
              <p className="text-sm text-gray-500">
                Monthly: ₹{b.monthlyFee} &middot; One-Time: ₹{b.oneTimeFee} &middot; {b.status}
              </p>
              <p className="text-xs text-gray-400 mt-1">ID: {b._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Batches;