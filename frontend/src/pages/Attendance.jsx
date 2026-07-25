import { useEffect, useState } from "react";
import api from "../services/api";
// eslint-disable-next-line no-unused-vars
import { CalendarCheck } from "lucide-react";

function Attendance() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState({});
  const [saving, setSaving] = useState(false);

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
    });
  }, [selectedBatch, date]);

  const batchStudents = students.filter((s) => s.batch?._id === selectedBatch);

  const markStatus = async (studentId, status) => {
    setSaving(true);
    try {
      await api.post("/attendance", { student: studentId, batch: selectedBatch, date, status });
      setRecords({ ...records, [studentId]: status });
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(records).filter((s) => s === "present").length;
  const absentCount = Object.values(records).filter((s) => s === "absent").length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-400">Mark daily attendance by batch</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
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
        <div className="flex-1 min-w-[200px]">
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
              className={`flex items-center justify-between px-6 py-4 ${
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
              <div className="flex gap-2">
                <button
                  disabled={saving}
                  onClick={() => markStatus(s._id, "present")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    records[s._id] === "present"
                      ? "bg-green-600 text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-green-50"
                  }`}
                >
                  Present
                </button>
                <button
                  disabled={saving}
                  onClick={() => markStatus(s._id, "absent")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    records[s._id] === "absent"
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