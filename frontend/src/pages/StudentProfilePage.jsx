/* eslint-disable react-hooks/static-components */
import { useStudentAuth } from "../context/StudentAuthContext";
import studentApi from "../services/studentApi";
import { useState } from "react";
import { Phone, Mail, MapPin, Calendar, Lock } from "lucide-react";

function StudentProfilePage() {
  const { student } = useStudentAuth();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);
    try {
      await studentApi.patch("/student-auth/password", passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    }
  };

  const Row = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <Icon size={16} className="text-gray-400 flex-shrink-0" />
      <span className="text-sm text-gray-500 w-32 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 h-fit">
          <div className="flex items-center gap-5 mb-6">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.name} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
                {student.name?.[0]}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-sm text-gray-400">{student.memberId}</p>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  student.status === "live"
                    ? "bg-green-50 text-green-700"
                    : student.status === "demo"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {student.status}
              </span>
            </div>
          </div>
          <Row icon={Phone} label="Mobile" value={student.mobile} />
          <Row icon={Mail} label="Email" value={student.email} />
          <Row icon={MapPin} label="Address" value={student.address} />
          <Row icon={Calendar} label="Join Date" value={student.joinDate ? new Date(student.joinDate).toLocaleDateString() : null} />
          <Row icon={Calendar} label="Batch" value={student.batch?.name} />
        </div>

        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Change Password</h2>
          </div>
          {passwordError && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{passwordError}</p>}
          <input
            type="password"
            placeholder="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700">
              Update Password
            </button>
            {passwordSaved && <span className="text-xs text-green-600 font-medium">Updated ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentProfilePage;