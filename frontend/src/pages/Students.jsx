import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Search, Phone } from "lucide-react";

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/students")
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.memberId.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = {
    live: "bg-green-50 text-green-700",
    demo: "bg-amber-50 text-amber-700",
    expired: "bg-red-50 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-400">{students.length} total students</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No students found.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {filtered.map((s, i) => (
            <div
              key={s._id}
              onClick={() => navigate(`/students/${s._id}`)}
              className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition ${
                i !== filtered.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {s.photoUrl ? (
                  <img
                    src={s.photoUrl}
                    alt={s.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                    {s.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.memberId}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                {s.mobile && (
                  <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone size={14} />
                    {s.mobile}
                  </div>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[s.status]}`}
                >
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;