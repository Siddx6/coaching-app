import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Search, Phone, DollarSign, Pencil, IdCard } from "lucide-react";

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [dues, setDues] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/students").then(async (res) => {
      setStudents(res.data);
      setLoading(false);

      const dueMap = {};
      await Promise.all(
        res.data.map(async (s) => {
          try {
            const paymentsRes = await api.get(`/payments/student/${s._id}`);
            const latest = paymentsRes.data[0];
            dueMap[s._id] = {
              paid: latest?.paidAmount ?? 0,
              due: latest?.dueAmount ?? 0,
              total: latest?.totalFee ?? 0,
            };
          } catch {
            dueMap[s._id] = { paid: 0, due: 0, total: 0 };
          }
        })
      );
      setDues(dueMap);
    });
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.memberId.toLowerCase().includes(search.toLowerCase())
  );

  const printIdCard = (s) => {
    const cardWindow = window.open("", "_blank");
    cardWindow.document.write(`
      <html>
        <head>
          <title>ID Card - ${s.name}</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 40px; background: #f3f4f6; }
            .card {
              width: 340px;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              background: white;
            }
            .header {
              background: linear-gradient(135deg, #4F46E5, #6366F1);
              color: white;
              padding: 20px 20px 55px;
              text-align: center;
            }
            .header h2 { margin: 0; font-size: 18px; }
            .header p { margin: 4px 0 0; font-size: 12px; opacity: 0.85; }
            .photo {
              width: 90px;
              height: 90px;
              border-radius: 50%;
              object-fit: cover;
              border: 4px solid white;
              margin: -45px auto 10px;
              display: block;
              background: #e5e7eb;
              position: relative;
              z-index: 1;
            }
            .body { padding: 10px 24px 24px; text-align: center; }
            .name { font-size: 18px; font-weight: bold; margin: 4px 0; }
            .id { color: #6366F1; font-size: 13px; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; font-size: 13px; }
            .label { color: #888; }
            .value { font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>GoCoaching</h2>
              <p>Student ID Card</p>
            </div>
            ${s.photoUrl ? `<img class="photo" src="${s.photoUrl}" />` : `<div class="photo"></div>`}
            <div class="body">
              <p class="name">${s.name}</p>
              <p class="id">${s.memberId}</p>
              <div class="row"><span class="label">Mobile</span><span class="value">${s.mobile || "-"}</span></div>
              <div class="row"><span class="label">Batch</span><span class="value">${s.batch?.name || "-"}</span></div>
              <div class="row"><span class="label">Join Date</span><span class="value">${s.joinDate ? new Date(s.joinDate).toLocaleDateString() : "-"}</span></div>
              <div class="row"><span class="label">Status</span><span class="value">${s.status}</span></div>
            </div>
          </div>
        </body>
      </html>
    `);
    cardWindow.document.close();
    cardWindow.focus();
    cardWindow.print();
  };

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
        <div className="grid gap-4">
          {filtered.map((s) => {
            const d = dues[s._id] || { paid: 0, due: 0, total: 0 };
            return (
              <div key={s._id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {s.photoUrl ? (
                      <img
                        src={s.photoUrl}
                        alt={s.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-lg">
                        {s.name?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400 mb-1">{s.memberId}</p>
                      {s.mobile && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Phone size={13} />
                          {s.mobile}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[s.status]}`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Course</p>
                    <p className="text-gray-800">{s.batch?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Join Date</p>
                    <p className="text-gray-800">
                      {s.joinDate ? new Date(s.joinDate).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Paid</p>
                    <p className="text-green-600 font-medium">₹{d.paid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Due</p>
                    <p className="text-red-500 font-medium">₹{d.due}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-gray-800 font-medium">₹{d.total}</p>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-gray-50 pt-4">
                  <button
                    onClick={() => navigate(`/students/${s._id}`)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100"
                  >
                    <DollarSign size={13} />
                    Add Pay
                  </button>
                  <button
                    onClick={() => navigate(`/students/${s._id}/edit`)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => printIdCard(s)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
                  >
                    <IdCard size={13} />
                    ID Card
                  </button>
                  <button
                    onClick={() => navigate(`/students/${s._id}/profile`)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Students;