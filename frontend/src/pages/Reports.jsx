/* eslint-disable react-hooks/static-components */
import { useEffect, useState } from "react";
import api from "../services/api";
import { TrendingUp, TrendingDown } from "lucide-react";

function Reports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  const netProfit = stats.collection.total - stats.expense.total;

  const Row = ({ label, today, month, total }) => (
    <div className="grid grid-cols-4 py-3 border-b border-gray-50 text-sm last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-center text-gray-700">{today}</span>
      <span className="text-center text-gray-700">{month}</span>
      <span className="text-center font-semibold text-gray-900">{total}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-400">Financial and student overview</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Financial Summary</h2>
          <div className="grid grid-cols-4 py-2 border-b border-gray-100 text-xs text-gray-400 font-medium">
            <span>Metric</span>
            <span className="text-center">Today</span>
            <span className="text-center">Month</span>
            <span className="text-center">Total</span>
          </div>
          <Row label="Joinings" today={stats.joining.today} month={stats.joining.month} total={stats.joining.total} />
          <Row
            label="Collection (₹)"
            today={stats.collection.today}
            month={stats.collection.month}
            total={stats.collection.total}
          />
          <Row
            label="Expense (₹)"
            today={stats.expense.today}
            month={stats.expense.month}
            total={stats.expense.total}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Net Profit / Loss</h2>
            <p className="text-xs text-gray-400 mb-4">Collection minus expense</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  netProfit >= 0 ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {netProfit >= 0 ? (
                  <TrendingUp size={18} className="text-green-600" />
                ) : (
                  <TrendingDown size={18} className="text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{netProfit}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              ₹{stats.collection.total} &minus; ₹{stats.expense.total}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <h2 className="font-semibold text-gray-900 mb-6">Student Breakdown</h2>
        <div className="grid grid-cols-3 gap-6">
          {(() => {
            const maxVal = Math.max(stats.students.live, stats.students.demo, stats.students.expired, 1);
            const rows = [
              { label: "Live", value: stats.students.live, color: "bg-indigo-600" },
              { label: "Demo", value: stats.students.demo, color: "bg-amber-400" },
              { label: "Expired", value: stats.students.expired, color: "bg-gray-300" },
            ];
            return rows.map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-full h-24 bg-gray-50 rounded-lg flex items-end p-2">
                  <div
                    className={`${color} w-full rounded`}
                    style={{ height: `${Math.max((value / maxVal) * 100, 8)}%` }}
                  ></div>
                </div>
                <p className="text-lg font-bold text-gray-900 mt-3">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}

export default Reports;