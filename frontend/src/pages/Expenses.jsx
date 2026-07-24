import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
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
      loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p className="text-red-600">Only Admins can view Expenses.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-2">Manage Expenses</h1>
      <p className="text-gray-500 mb-6">Total Expenses: ₹{total}</p>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-lg space-y-3">
        <h2 className="font-semibold text-gray-700">Add Expense</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g. Electricity Bill)"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full border rounded px-3 py-2"
        />
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Add Expense
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-gray-500">No expenses recorded.</p>
      ) : (
        <div className="grid gap-3 max-w-2xl">
          {expenses.map((e) => (
            <div key={e._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{e.category}</p>
                <p className="text-sm text-gray-500">{e.notes}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">₹{e.amount}</p>
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