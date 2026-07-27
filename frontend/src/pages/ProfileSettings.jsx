import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { User, Lock } from "lucide-react";

function ProfileSettings() {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: "", mobile: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setProfileForm({ name: res.data.name, mobile: res.data.mobile || "" });
    });
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSaved(false);
    try {
      const res = await api.patch("/auth/me", profileForm);
      const updatedUser = { ...user, name: res.data.name, mobile: res.data.mobile };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      setProfileSaved(true);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);
    try {
      await api.patch("/auth/me/password", passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-400">Manage your account details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Profile Info</h2>
          </div>
          {profileError && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{profileError}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Name</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Mobile</label>
            <input
              value={profileForm.mobile}
              onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700">
              Save Changes
            </button>
            {profileSaved && <span className="text-xs text-green-600 font-medium">Saved ✓</span>}
          </div>
        </form>

        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Change Password</h2>
          </div>
          {passwordError && <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3">{passwordError}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
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

export default ProfileSettings;