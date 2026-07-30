import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Plus, Wallet } from "lucide-react";

function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "", amount: "", notes: "" });
  const [error, setError] = useState("");

  const loadExpenses = () => {
    setLoading(true);
    api
      .get("/expenses")
      .then((res) => setExpenses(res.data))
      .catch(() => setError("Not authorized to view expenses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadExpenses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/expenses", form);
      setForm({ category: "", amount: "", notes: "" });
      setShowForm(false);
      loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">Only Admins can view Expenses.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-400">Total Expenses: ₹{total}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 max-w-lg space-y-4"
        >
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Electricity Bill"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Amount</label>
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              type="number"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Notes</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Add Expense
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-gray-400">No expenses recorded.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {expenses.map((e, i) => (
            <div
              key={e._id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4 ${
                i !== expenses.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <Wallet size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{e.category}</p>
                  <p className="text-xs text-gray-400">{e.notes}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600 text-sm">₹{e.amount}</p>
                <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Expenses;