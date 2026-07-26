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
  KeyRound,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Navbar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const allLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, key: null },
    { to: "/master", label: "Master Setup", icon: BookOpen, key: "masterSetup" },
    { to: "/students", label: "Students", icon: Users, key: "students" },
    { to: "/students/add", label: "Add Student", icon: UserPlus, key: "students" },
    { to: "/batches", label: "Batches", icon: Layers, key: "batches" },
    { to: "/enquiries", label: "Enquiries", icon: ClipboardList, key: "enquiries" },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck, key: "attendance" },
    { to: "/expenses", label: "Expenses", icon: Wallet, key: "expenses" },
    { to: "/admin/users", label: "Users", icon: ShieldCheck, key: "adminOnly" },
    { to: "/admin/permissions", label: "Manage Users", icon: KeyRound, key: "adminOnly" },
    { to: "/reports", label: "Reports", icon: BarChart3, key: "reports" },
  ];

  const links = allLinks.filter((link) => {
    if (user.role === "admin") return true;
    if (link.key === null) return true;
    if (link.key === "adminOnly") return false;
    return !!user.permissions?.[link.key];
  });

  return (
    <div
      className={`min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2 overflow-hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M12 2L14 9L21 9L15.5 13.5L17.5 21L12 16.5L6.5 21L8.5 13.5L3 9L10 9L12 2Z" fill="#4F46E5"/>
          </svg>
          <span
            className={`font-bold text-lg text-gray-900 whitespace-nowrap transition-opacity duration-200 ${
              collapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            GoCoaching
          </span>
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-all duration-200 ${
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <div
          className={`flex items-center gap-3 px-3 py-3 border-t border-gray-100 pt-4 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
            {user.name?.[0]}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-red-600">
                <LogOut size={17} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;