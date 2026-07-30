 import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Plus, Layers, Pencil, Trash2, X, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

function Batches() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [subCourses, setSubCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subCourse: "", name: "", monthlyFee: "", oneTimeFee: "" });
  const [error, setError] = useState("");
  const [editingBatch, setEditingBatch] = useState(null);
  const [editForm, setEditForm] = useState({ subCourse: "", name: "", monthlyFee: "", oneTimeFee: "", status: "live" });
  const [qrBatch, setQrBatch] = useState(null);

  const loadBatches = () => {
    setLoading(true);
    api
      .get("/batches")
      .then((res) => setBatches(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBatches();
    api.get("/subcourses").then((res) => setSubCourses(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/batches", form);
      setForm({ subCourse: "", name: "", monthlyFee: "", oneTimeFee: "" });
      setShowForm(false);
      loadBatches();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add batch");
    }
  };

  const startEdit = (b) => {
    setEditingBatch(b._id);
    setEditForm({
      subCourse: b.subCourse?._id || "",
      name: b.name,
      monthlyFee: b.monthlyFee,
      oneTimeFee: b.oneTimeFee,
      status: b.status,
    });
  };

  const saveEdit = async (id) => {
    await api.patch(`/batches/${id}`, editForm);
    setEditingBatch(null);
    loadBatches();
  };

  const deleteBatch = async (id) => {
    if (!window.confirm("Delete this batch?")) return;
    await api.delete(`/batches/${id}`);
    loadBatches();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-sm text-gray-400">{batches.length} active batches</p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16} />
            Add Batch
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 max-w-lg space-y-4"
        >
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Sub-Course</label>
            <select
              name="subCourse"
              value={form.subCourse}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a sub-course</option>
              {subCourses.map((sc) => (
                <option key={sc._id} value={sc._id}>
                  {sc.course?.name} — {sc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Batch Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Monthly Fee</label>
              <input
                name="monthlyFee"
                value={form.monthlyFee}
                onChange={handleChange}
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">One-Time Fee</label>
              <input
                name="oneTimeFee"
                value={form.oneTimeFee}
                onChange={handleChange}
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Add Batch
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : batches.length === 0 ? (
        <p className="text-gray-400">No batches found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((b) =>
            editingBatch === b._id ? (
              <div key={b._id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <select
                  value={editForm.subCourse}
                  onChange={(e) => setEditForm({ ...editForm, subCourse: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subCourses.map((sc) => (
                    <option key={sc._id} value={sc._id}>
                      {sc.course?.name} — {sc.name}
                    </option>
                  ))}
                </select>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={editForm.monthlyFee}
                    onChange={(e) => setEditForm({ ...editForm, monthlyFee: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Monthly Fee"
                  />
                  <input
                    type="number"
                    value={editForm.oneTimeFee}
                    onChange={(e) => setEditForm({ ...editForm, oneTimeFee: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="One-Time Fee"
                  />
                </div>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="live">Live</option>
                  <option value="ended">Ended</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(b._id)}
                    className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBatch(null)}
                    className="border border-gray-200 text-gray-600 px-3 rounded-lg hover:bg-gray-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div key={b._id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Layers size={18} className="text-gray-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        b.status === "live" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {b.status}
                    </span>
                    {user?.role === "admin" && (
                      <>
                        <button onClick={() => startEdit(b)} className="text-gray-300 hover:text-indigo-600">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteBatch(b._id)} className="text-gray-300 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="font-semibold text-gray-900">{b.name}</p>
                <p className="text-xs text-indigo-600 mt-0.5">
                  {b.subCourse?.course?.name} &rsaquo; {b.subCourse?.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  ₹{b.monthlyFee}/mo &middot; ₹{b.oneTimeFee} one-time
                </p>
                <button
                  onClick={() => setQrBatch(b)}
                  className="flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 mt-3"
                >
                  <QrCode size={13} />
                  View QR
                </button>
              </div>
            )
          )}
        </div>
      )}

      {qrBatch && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setQrBatch(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrBatch(null)}
              className="float-right text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
            <h2 className="font-semibold text-gray-900 mb-1">{qrBatch.name}</h2>
            <p className="text-xs text-gray-400 mb-6">
              {qrBatch.subCourse?.course?.name} &rsaquo; {qrBatch.subCourse?.name}
            </p>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={qrBatch._id} size={180} />
            </div>
            <p className="text-xs text-gray-400">Batch ID: {qrBatch._id}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Batches;