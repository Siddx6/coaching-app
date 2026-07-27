/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Phone, Mail, Receipt, Trash2, Printer } from "lucide-react";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDeleteStudent = async () => {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    await api.delete(`/students/${id}`);
    navigate("/students");
  };

  const handleStatusChange = async (newStatus) => {
    await api.patch(`/students/${id}/status`, { status: newStatus });
    loadData();
  };

  const printReceipt = (payment) => {
    const receiptWindow = window.open("", "_blank");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${payment.receiptNo || payment._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #4F46E5; margin-bottom: 4px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { color: #666; }
            .value { font-weight: 600; }
            .total { font-size: 20px; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GoCoaching</h1>
            <p>Payment Receipt</p>
          </div>
          <div class="row"><span class="label">Receipt No.</span><span class="value">${payment.receiptNo || "-"}</span></div>
          <div class="row"><span class="label">Date</span><span class="value">${new Date(payment.date).toLocaleDateString()}</span></div>
          <div class="row"><span class="label">Student Name</span><span class="value">${student.name}</span></div>
          <div class="row"><span class="label">Member ID</span><span class="value">${student.memberId}</span></div>
          <div class="row"><span class="label">Payment Mode</span><span class="value">${payment.mode}</span></div>
          <div class="row"><span class="label">Total Fee</span><span class="value">₹${payment.totalFee}</span></div>
          <div class="row"><span class="label">Amount Paid</span><span class="value">₹${payment.paidAmount}</span></div>
          <div class="row total"><span class="label">Due Amount</span><span class="value">₹${payment.dueAmount}</span></div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
  };

  if (!student) return <div className="p-8">Loading...</div>;

  const latestDue = payments[0]?.dueAmount ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/students")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Back to Students
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/students/${id}/edit`)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteStudent}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
          >
            <Trash2 size={15} />
            Delete Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-5">
        {student.photoUrl ? (
          <img
            src={student.photoUrl}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
            {student.name?.[0]}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-sm text-gray-400">{student.memberId}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {student.mobile && (
              <span className="flex items-center gap-1.5">
                <Phone size={14} /> {student.mobile}
              </span>
            )}
            {student.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={14} /> {student.email}
              </span>
            )}
          </div>
        </div>
        <div className="text-right space-y-2">
          <div>
            <p className="text-xs text-gray-400">Current Due</p>
            <p className={`text-2xl font-bold ${latestDue > 0 ? "text-red-600" : "text-green-600"}`}>
              ₹{latestDue}
            </p>
          </div>
          <select
            value={student.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none capitalize"
          >
            <option value="live">Live</option>
            <option value="demo">Demo</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 h-fit"
        >
          <h2 className="font-semibold text-gray-900">Add Payment</h2>
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Total Fee</label>
              <input
                name="totalFee"
                value={form.totalFee}
                onChange={handleChange}
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Paid Amount</label>
              <input
                name="paidAmount"
                value={form.paidAmount}
                onChange={handleChange}
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Mode</label>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Receipt No.</label>
            <input
              name="receiptNo"
              value={form.receiptNo}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Add Payment
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Payment History</h2>
          {payments.length === 0 ? (
            <p className="text-gray-400 text-sm">No payments yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p._id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Receipt size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Paid ₹{p.paidAmount} of ₹{p.totalFee}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.date).toLocaleDateString()} &middot; {p.mode} &middot; {p.receiptNo}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-red-500">Due ₹{p.dueAmount}</span>
                  <button
                    onClick={() => printReceipt(p)}
                    className="text-gray-300 hover:text-indigo-600"
                    title="Print Receipt"
                  >
                    <Printer size={15} />
                  </button>
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