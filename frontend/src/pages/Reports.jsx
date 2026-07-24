/* eslint-disable react-hooks/static-components */
import { useEffect, useState } from "react";
import api from "../services/api";

function Reports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-6">Loading...</div>;

  const netProfit = stats.collection.total - stats.expense.total;

  const Row = ({ label, today, month, total }) => (
    <div className="grid grid-cols-4 py-2 border-b text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="text-center">{today}</span>
      <span className="text-center">{month}</span>
      <span className="text-center font-semibold">{total}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Reports</h1>

      <div className="bg-white p-6 rounded shadow max-w-2xl mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Financial Summary</h2>
        <div className="grid grid-cols-4 py-2 border-b text-xs text-gray-400 font-medium">
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

      <div className="bg-white p-6 rounded shadow max-w-2xl mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Net Profit / Loss</h2>
        <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
          ₹{netProfit}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Total Collection (₹{stats.collection.total}) &minus; Total Expense (₹{stats.expense.total})
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <h2 className="font-semibold text-gray-700 mb-4">Student Breakdown</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.students.live}</p>
            <p className="text-sm text-gray-500">Live</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{stats.students.demo}</p>
            <p className="text-sm text-gray-500">Demo</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{stats.students.expired}</p>
            <p className="text-sm text-gray-500">Expired</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;