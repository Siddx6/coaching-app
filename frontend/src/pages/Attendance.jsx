import { useEffect, useState } from "react";
import api from "../services/api";

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Attendance</h1>

      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 max-w-lg">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {!selectedBatch ? (
        <p className="text-gray-500">Select a batch to mark attendance.</p>
      ) : batchStudents.length === 0 ? (
        <p className="text-gray-500">No students in this batch.</p>
      ) : (
        <div className="grid gap-3 max-w-2xl">
          {batchStudents.map((s) => (
            <div key={s._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-500">{s.memberId}</p>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={saving}
                  onClick={() => markStatus(s._id, "present")}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    records[s._id] === "present"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-green-100"
                  }`}
                >
                  Present
                </button>
                <button
                  disabled={saving}
                  onClick={() => markStatus(s._id, "absent")}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    records[s._id] === "absent"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-red-100"
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