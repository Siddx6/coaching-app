import { useEffect, useState } from "react";
import { useStudentAuth } from "../context/StudentAuthContext";
import studentApi from "../services/studentApi";
import { CheckCircle, XCircle } from "lucide-react";

function StudentAttendance() {
  const { student } = useStudentAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    studentApi
      .get("/attendance/my")
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecords(sorted);
      })
      .catch((err) => console.error("Attendance fetch failed:", err))
      .finally(() => setLoading(false));
  }, [student]);

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-sm text-gray-400">{student.batch?.name || "—"}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          <p className="text-sm text-gray-400">Present</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-2xl font-bold text-red-500">{absentCount}</p>
          <p className="text-sm text-gray-400">Absent</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-400">No attendance records yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-md">
          {records.map((r, i) => (
            <div
              key={r._id}
              className={`flex items-center justify-between px-6 py-4 ${
                i !== records.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-sm text-gray-700">{new Date(r.date).toLocaleDateString()}</span>
              {r.status === "present" ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <CheckCircle size={15} /> Present
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                  <XCircle size={15} /> Absent
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentAttendance;