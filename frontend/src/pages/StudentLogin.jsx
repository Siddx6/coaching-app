import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "../context/StudentAuthContext";
import { Eye, EyeOff } from "lucide-react";

function StudentLogin() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { studentLogin } = useStudentAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await studentLogin(memberId, password);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center gap-2 mb-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14 9L21 9L15.5 13.5L17.5 21L12 16.5L6.5 21L8.5 13.5L3 9L10 9L12 2Z" fill="#4F46E5"/>
          </svg>
          <span className="font-bold text-lg text-gray-900">GoCoaching</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Student Login</h1>
        <p className="text-sm text-gray-400 mb-6">Access your fees, attendance, and notices</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Member ID</label>
            <input
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;