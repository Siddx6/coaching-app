import { useEffect, useState } from "react";
import api from "../services/api";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
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
    new: "bg-blue-100 text-blue-700",
    followup: "bg-yellow-100 text-yellow-700",
    converted: "bg-green-100 text-green-700",
    closed: "bg-gray-200 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Enquiry Management</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-lg space-y-3">
        <h2 className="font-semibold text-gray-700">New Enquiry</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="courseInterest"
          value={form.courseInterest}
          onChange={handleChange}
          placeholder="Course Interest"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="source"
          value={form.source}
          onChange={handleChange}
          placeholder="Source (e.g. Walk-in, Referral)"
          className="w-full border rounded px-3 py-2"
        />
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Add Enquiry
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : enquiries.length === 0 ? (
        <p className="text-gray-500">No enquiries found.</p>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((e) => (
            <div key={e._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{e.name}</p>
                <p className="text-sm text-gray-500">
                  {e.mobile} &middot; {e.courseInterest || "No course specified"} &middot; {e.source}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[e.status]}`}>
                  {e.status}
                </span>
                <select
                  value={e.status}
                  onChange={(ev) => updateStatus(e._id, ev.target.value)}
                  className="border rounded px-2 py-1 text-sm"
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