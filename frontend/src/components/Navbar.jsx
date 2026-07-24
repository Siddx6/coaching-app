import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 rounded text-sm font-medium ${
      location.pathname === path
        ? "bg-purple-700 text-white"
        : "text-gray-600 hover:bg-purple-100"
    }`;

  if (!user) return null;

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-purple-700 mr-4">Coaching App</span>
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
        <Link to="/students" className={linkClass("/students")}>
          Students
        </Link>
        <Link to="/students/add" className={linkClass("/students/add")}>
          Add Student
        </Link>
        <Link to="/batches" className={linkClass("/batches")}>
          Batches
        </Link>
        <Link to="/enquiries" className={linkClass("/enquiries")}>
          Enquiries
        </Link>
        <Link to="/attendance" className={linkClass("/attendance")}>
          Attendance
        </Link>
        <Link to="/expenses" className={linkClass("/expenses")}>
          Expenses
        </Link>
        <Link to="/admin/users" className={linkClass("/admin/users")}>
          Users
        </Link>
        <Link to="/reports" className={linkClass("/reports")}>
          Reports
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{user.name} ({user.role})</span>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;