/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Plus, Wallet, Trash2, Star } from "lucide-react";

function EnrollmentFees() {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", isDefault: false });
  const [error, setError] = useState("");

  const loadFees = () => {
    setLoading(true);
    api
      .get("/enrollment-fees")
      .then((res) => setFees(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/enrollment-fees", form);
      setForm({ name: "", amount: "", isDefault: false });
      setShowForm(false);
      loadFees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add fee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enrollment fee?")) return;
    await api.delete(`/enrollment-fees/${id}`);
    loadFees();
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">Only Admins can manage enrollment fees.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollment Fees</h1>
          <p className="text-sm text-gray-400">Define preset enrollment fees for new students</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Fee
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
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Standard Enrollment"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Amount</label>
            <input
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              type="number"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="rounded"
            />
            Set as default (auto-fills on Add Student)
          </label>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Add Fee
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : fees.length === 0 ? (
        <p className="text-gray-400">No enrollment fees defined.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-2xl">
          {fees.map((f, i) => (
            <div
              key={f._id}
              className={`flex flex-wrap items-center justify-between gap-2 px-6 py-4 ${
                i !== fees.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Wallet size={16} className="text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{f.name}</p>
                    {f.isDefault && <Star size={13} className="text-amber-500 fill-amber-500" />}
                  </div>
                  <p className="text-xs text-gray-400">₹{f.amount}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(f._id)} className="text-gray-300 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnrollmentFees;