import { useEffect, useState } from "react";
import api from "../services/api";

function Attendance() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState({});
  const [pending, setPending] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/batches").then((res) => setBatches(res.data));
    api.get("/students").then((res) => setStudents(res.data));
  }, []);

  useEffect(() => {
    if (!selectedBatch || !date) return;
    api.get(`/attendance?batchId=${selectedBatch}&date=${date}`).then((res) => {
      const map = {};
      res.data.forEach((r) => {
        map[r.student._id] = r.status;
      });
      setRecords(map);
      setPending({});
      setSaved(false);
    });
  }, [selectedBatch, date]);

  const batchStudents = students.filter((s) => s.batch?._id === selectedBatch);

  const markStatus = (studentId, status) => {
    setPending({ ...pending, [studentId]: status });
    setSaved(false);
  };

  const displayStatus = (studentId) => pending[studentId] ?? records[studentId];

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(pending);
      await Promise.all(
        entries.map(([studentId, status]) =>
          api.post("/attendance", { student: studentId, batch: selectedBatch, date, status })
        )
      );
      setRecords({ ...records, ...pending });
      setPending({});
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const combined = { ...records, ...pending };
  const presentCount = Object.values(combined).filter((s) => s === "present").length;
  const absentCount = Object.values(combined).filter((s) => s === "absent").length;
  const hasPending = Object.keys(pending).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-400">Mark daily attendance by batch</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <label className="block text-sm font-medium text-gray-500 mb-1.5">Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <label className="block text-sm font-medium text-gray-500 mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {selectedBatch && (
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">{presentCount} Present</span>
            <span className="text-red-500 font-medium">{absentCount} Absent</span>
          </div>
        )}
        {hasPending && (
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        )}
        {saved && !hasPending && (
          <span className="text-sm text-green-600 font-medium">Saved ✓</span>
        )}
      </div>

      {!selectedBatch ? (
        <p className="text-gray-400">Select a batch to mark attendance.</p>
      ) : batchStudents.length === 0 ? (
        <p className="text-gray-400">No students in this batch.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {batchStudents.map((s, i) => (
            <div
              key={s._id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 ${
                i !== batchStudents.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {s.photoUrl ? (
                  <img src={s.photoUrl} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                    {s.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.memberId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {pending[s._id] && (
                  <span className="text-xs text-amber-600 font-medium">Unsaved</span>
                )}
                <button
                  onClick={() => markStatus(s._id, "present")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    displayStatus(s._id) === "present"
                      ? "bg-green-600 text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-green-50"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => markStatus(s._id, "absent")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    displayStatus(s._id) === "absent"
                      ? "bg-red-500 text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-red-50"
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Attendance;