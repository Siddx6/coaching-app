import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/batches").then((res) => setBatches(res.data));
    api.get("/students").then((res) => {
      const s = res.data.find((s) => s._id === id);
      if (s) {
        setForm({
          memberId: s.memberId || "",
          name: s.name || "",
          mobile: s.mobile || "",
          email: s.email || "",
          gender: s.gender || "male",
          address: s.address || "",
          batch: s.batch?._id || "",
          joinDate: s.joinDate ? s.joinDate.split("T")[0] : "",
          endDate: s.endDate ? s.endDate.split("T")[0] : "",
          password: "",
        });
      }
    });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.patch(`/students/${id}`, form);
      navigate(`/students/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update student");
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
        <p className="text-sm text-gray-400">Update student details</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 max-w-2xl"
      >
        {error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3 mb-6">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Member ID</label>
            <input
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Join Date</label>
            <input
              type="date"
              name="joinDate"
              value={form.joinDate}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Portal Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep unchanged"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Batch</label>
            <select
              name="batch"
              value={form.batch}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a batch</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} (₹{b.monthlyFee}/mo)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate(`/students/${id}`)}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;