import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Camera } from "lucide-react";

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
    endDate: "",
    enrollmentFee: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    api.get("/batches").then((res) => setBatches(res.data));
    api.get("/enrollment-fees").then((res) => {
      const defaultFee = res.data.find((f) => f.isDefault);
      if (defaultFee) {
        setForm((prev) => ({ ...prev, enrollmentFee: defaultFee.amount }));
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleDocumentsChange = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (photo) formData.append("photo", photo);
      documents.forEach((doc) => formData.append("documents", doc));

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Student</h1>
        <p className="text-sm text-gray-400">Enroll a new student into a batch</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl"
      >
        {error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3 mb-6">{error}</p>
        )}

        <div className="flex justify-center mb-8">
          <label className="relative cursor-pointer">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-50"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-gray-50 flex items-center justify-center">
                <Camera size={24} className="text-gray-300" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
              <Camera size={13} className="text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

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
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Enrollment Fee</label>
            <input
              name="enrollmentFee"
              value={form.enrollmentFee}
              onChange={handleChange}
              type="number"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Portal Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Set login password for student"
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

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Documents</label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleDocumentsChange}
              className="w-full text-sm"
            />
            {documents.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">{documents.length} file(s) selected</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 mt-8"
        >
          {submitting ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;