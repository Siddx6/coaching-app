import { useEffect, useState } from "react";
import { useStudentAuth } from "../context/StudentAuthContext";
import studentApi from "../services/studentApi";
import { Phone, Mail, Bell, Receipt } from "lucide-react";

function StudentPortal() {
  const { student } = useStudentAuth();
  const [payments, setPayments] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    studentApi.get(`/payments/student/${student._id}`).then((res) => setPayments(res.data));
    studentApi.get("/notices").then((res) =>
      setNotices(res.data.filter((n) => n.audience === "all" || n.audience === "students"))
    );
  }, [student]);

  const latestDue = payments[0]?.dueAmount ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
        {student.photoUrl ? (
          <img src={student.photoUrl} alt={student.name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
            {student.name?.[0]}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-sm text-gray-400">{student.memberId}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {student.mobile && <span className="flex items-center gap-1.5"><Phone size={14} /> {student.mobile}</span>}
            {student.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {student.email}</span>}
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-xs text-gray-400">Current Due</p>
          <p className={`text-2xl font-bold ${latestDue > 0 ? "text-red-600" : "text-green-600"}`}>₹{latestDue}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 mb-1">Batch</p>
          <p className="font-semibold text-gray-900">{student.batch?.name || "—"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <p className="font-semibold text-gray-900 capitalize">{student.status}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-sm font-medium text-gray-900">Paid ₹{p.paidAmount} of ₹{p.totalFee}</p>
                    <p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString()} &middot; {p.mode}</p>
                  </div>
                  <span className="text-xs font-medium text-red-500">Due ₹{p.dueAmount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Notices</h2>
          {notices.length === 0 ? (
            <p className="text-gray-400 text-sm">No notices.</p>
          ) : (
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n._id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Bell size={16} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-sm text-gray-600 break-words">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPortal;