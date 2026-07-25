import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { TrendingUp, Wallet, Users, UserPlus } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  const cards = [
    {
      label: "Total Joining",
      value: stats.joining.total,
      icon: UserPlus,
      sub: `${stats.joining.month} this month`,
    },
    {
      label: "Total Collection",
      value: `₹${stats.collection.total}`,
      icon: Wallet,
      sub: `₹${stats.collection.month} this month`,
    },
    {
      label: "Total Expense",
      value: `₹${stats.expense.total}`,
      icon: TrendingUp,
      sub: `₹${stats.expense.month} this month`,
    },
    {
      label: "Live Students",
      value: stats.students.live,
      icon: Users,
      sub: `${stats.students.demo} demo · ${stats.students.expired} expired`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
        <span className="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
          Last 30 days
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                <Icon size={18} className="text-gray-700" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
            <p className="text-xs text-gray-400 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Student Breakdown</h2>
          <span className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
            All
          </span>
        </div>
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

export default Dashboard;