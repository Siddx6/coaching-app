import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-10 sm:px-16 lg:px-24 py-14">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14 9L21 9L15.5 13.5L17.5 21L12 16.5L6.5 21L8.5 13.5L3 9L10 9L12 2Z" fill="#4F46E5"/>
            </svg>
            <span className="font-bold text-2xl text-gray-900">GoCoaching</span>
          </div>

          <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-base mb-10">
              Enter your email and password to access your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white text-base font-semibold py-3 rounded-lg hover:bg-indigo-700 transition mt-2"
              >
                Log In
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400 mt-14 w-full">
            <span>Copyright &copy; 2026 Coaching App LTD.</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Right: Promo panel */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-white text-4xl font-bold mb-4 leading-tight">
            Effortlessly manage your institute and students.
          </h2>
          <p className="text-indigo-200 mb-10 text-base">
            Log in to access your dashboard and manage your team.
          </p>

          <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Total Collection</p>
                <p className="text-2xl font-bold text-indigo-700">₹1.14L</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Live Students</p>
                <p className="text-2xl font-bold text-green-600">719</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-4">Monthly Joinings</p>
              <div className="flex items-end gap-1.5 h-16 mt-1">
                {[6, 10, 8, 14, 9, 13, 11].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-indigo-600 rounded-t"
                    style={{ height: `${h * 5}px` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;