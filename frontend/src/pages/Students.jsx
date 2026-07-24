import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/students")
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Manage Students
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <div className="grid gap-4">
          {students.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/students/${s._id}`)}
              className="bg-white p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-purple-50"
            >
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-500">
                  {s.memberId} &middot; {s.mobile}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  s.status === "live"
                    ? "bg-green-100 text-green-700"
                    : s.status === "demo"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;