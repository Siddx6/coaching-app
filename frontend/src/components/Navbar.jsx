import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserPlus,
  Layers,
  ClipboardList,
  CalendarCheck,
  Wallet,
  ShieldCheck,
  BarChart3,
  LogOut,
} from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/master", label: "Master Setup", icon: BookOpen },
    { to: "/students", label: "Students", icon: Users },
    { to: "/students/add", label: "Add Student", icon: UserPlus },
    { to: "/batches", label: "Batches", icon: Layers },
    { to: "/enquiries", label: "Enquiries", icon: ClipboardList },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
    { to: "/expenses", label: "Expenses", icon: Wallet },
    { to: "/admin/users", label: "Users", icon: ShieldCheck },
    { to: "/reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <div className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14 9L21 9L15.5 13.5L17.5 21L12 16.5L6.5 21L8.5 13.5L3 9L10 9L12 2Z" fill="#4F46E5"/>
        </svg>
        <span className="font-bold text-lg text-gray-900">GoCoaching</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <div className="flex items-center gap-3 px-3 py-3 border-t border-gray-100 pt-4">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
            {user.name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-600">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;