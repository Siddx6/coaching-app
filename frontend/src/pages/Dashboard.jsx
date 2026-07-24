import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-700">
          Welcome, {user?.name}
        </h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {stats ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Total Joining</p>
            <p className="text-2xl font-bold text-purple-700">
              {stats.joining.total}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Total Collection</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.collection.total}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.expense.total}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;