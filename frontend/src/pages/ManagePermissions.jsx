import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { ShieldCheck, Save } from "lucide-react";

const MODULES = [
  { key: "students", label: "Students" },
  { key: "batches", label: "Batches" },
  { key: "enquiries", label: "Enquiries" },
  { key: "attendance", label: "Attendance" },
  { key: "expenses", label: "Expenses" },
  { key: "reports", label: "Reports" },
  { key: "masterSetup", label: "Master Setup" },
];

function ManagePermissions() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data.filter((u) => u.role !== "admin")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  const togglePermission = (userId, key) => {
    setUsers(
      users.map((u) =>
        u._id === userId
          ? { ...u, permissions: { ...u.permissions, [key]: !u.permissions?.[key] } }
          : u
      )
    );
    setSavedId(null);
  };

  const savePermissions = async (u) => {
    setSavingId(u._id);
    try {
      await api.patch(`/admin/users/${u._id}/permissions`, { permissions: u.permissions });
      setSavedId(u._id);
    } finally {
      setSavingId(null);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">Only Admins can manage permissions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Permissions</h1>
        <p className="text-sm text-gray-400">Control which modules each Operator can access</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400">No operators to manage — add one from the Users page.</p>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {users.map((u) => (
            <div key={u._id} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-semibold text-sm">
                  {u.name?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <ShieldCheck size={16} className="text-gray-300" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {MODULES.map((m) => (
                  <label
                    key={m.key}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!u.permissions?.[m.key]}
                      onChange={() => togglePermission(u._id, m.key)}
                      className="rounded"
                    />
                    {m.label}
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => savePermissions(u)}
                  disabled={savingId === u._id}
                  className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Save size={13} />
                  {savingId === u._id ? "Saving..." : "Save"}
                </button>
                {savedId === u._id && (
                  <span className="text-xs text-green-600 font-medium">Saved ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManagePermissions;