import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ totalFee: "", paidAmount: "", mode: "cash", receiptNo: "" });
  const [error, setError] = useState("");

  const loadData = async () => {
    const studentsRes = await api.get("/students");
    const found = studentsRes.data.find((s) => s._id === id);
    setStudent(found);

    const paymentsRes = await api.get(`/payments/student/${id}`);
    setPayments(paymentsRes.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/payments", { student: id, ...form });
      setForm({ totalFee: "", paidAmount: "", mode: "cash", receiptNo: "" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add payment");
    }
  };

  if (!student) return <div className="p-6">Loading...</div>;

  const latestDue = payments[0]?.dueAmount ?? 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate("/students")} className="text-purple-700 text-sm mb-4">
        &larr; Back to Students
      </button>

      <h1 className="text-2xl font-bold text-purple-700 mb-2">{student.name}</h1>
      <p className="text-gray-500 mb-6">
        {student.memberId} &middot; {student.mobile} &middot; Current Due: ₹{latestDue}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 h-fit">
          <h2 className="font-semibold text-gray-700">Add Payment</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input
            name="totalFee"
            value={form.totalFee}
            onChange={handleChange}
            placeholder="Total Fee"
            type="number"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            name="paidAmount"
            value={form.paidAmount}
            onChange={handleChange}
            placeholder="Paid Amount"
            type="number"
            className="w-full border rounded px-3 py-2"
            required
          />
          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
          <input
            name="receiptNo"
            value={form.receiptNo}
            onChange={handleChange}
            placeholder="Receipt No."
            className="w-full border rounded px-3 py-2"
          />
          <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
            Add Payment
          </button>
        </form>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-gray-700 mb-3">Payment History</h2>
          {payments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payments yet.</p>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p._id} className="border-b pb-2">
                  <p className="text-sm">
                    Paid ₹{p.paidAmount} of ₹{p.totalFee} &middot; Due ₹{p.dueAmount}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(p.date).toLocaleDateString()} &middot; {p.mode} &middot; {p.receiptNo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;