import { Link, useLocation, useNavigate } from "react-router-dom";import { useStudentAuth } from "../context/StudentAuthContext";
import { LayoutDashboard, User, Calendar, LogOut } from "lucide-react";

function StudentNavbar() {
  const { student, studentLogout } = useStudentAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!student) return null;

  const links = [
    { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/attendance", label: "Attendance", icon: Calendar },
    { to: "/student/profile", label: "My Profile", icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14 9L21 9L15.5 13.5L17.5 21L12 16.5L6.5 21L8.5 13.5L3 9L10 9L12 2Z" fill="#4F46E5"/>
          </svg>
          <span className="font-bold text-gray-900">GoCoaching</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${
                location.pathname === to ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          studentLogout();
          navigate("/student/login");
        }}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600"
      >
        <LogOut size={15} />
        Logout
      </button>
    </nav>
  );
}

export default StudentNavbar;