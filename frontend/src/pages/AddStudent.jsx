import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    memberId: "",
    name: "",
    mobile: "",
    email: "",
    gender: "male",
    address: "",
    batch: "",
    joinDate: "",
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (photo) formData.append("photo", photo);

      await api.post("/students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/students");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Add Student</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-lg space-y-4"
      >
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label className="block text-sm text-gray-600 mb-1">Member ID</label>
          <input
            name="memberId"
            value={form.memberId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Batch ID</label>
          <input
            name="batch"
            value={form.batch}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Paste Batch _id for now"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Join Date</label>
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;