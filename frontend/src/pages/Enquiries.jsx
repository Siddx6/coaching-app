import { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, Phone } from "lucide-react";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", courseInterest: "", source: "" });
  const [error, setError] = useState("");

  const loadEnquiries = () => {
    setLoading(true);
    api
      .get("/enquiries")
      .then((res) => setEnquiries(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEnquiries();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/enquiries", form);
      setForm({ name: "", mobile: "", courseInterest: "", source: "" });
      setShowForm(false);
      loadEnquiries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add enquiry");
    }
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/enquiries/${id}`, { status });
    loadEnquiries();
  };

  const statusColor = {
    new: "bg-blue-50 text-blue-700",
    followup: "bg-amber-50 text-amber-700",
    converted: "bg-green-50 text-green-700",
    closed: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-sm text-gray-400">{enquiries.length} total enquiries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={16} />
          New Enquiry
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 max-w-lg space-y-4"
        >
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Course Interest</label>
            <input
              name="courseInterest"
              value={form.courseInterest}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Source</label>
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              placeholder="Walk-in, Referral, etc."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Add Enquiry
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : enquiries.length === 0 ? (
        <p className="text-gray-400">No enquiries found.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {enquiries.map((e, i) => (
            <div
              key={e._id}
              className={`flex items-center justify-between px-6 py-4 ${
                i !== enquiries.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">{e.name}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> {e.mobile}
                  </span>
                  <span>{e.courseInterest || "No course specified"}</span>
                  <span>{e.source}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[e.status]}`}>
                  {e.status}
                </span>
                <select
                  value={e.status}
                  onChange={(ev) => updateStatus(e._id, ev.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                >
                  <option value="new">New</option>
                  <option value="followup">Follow-up</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Enquiries;