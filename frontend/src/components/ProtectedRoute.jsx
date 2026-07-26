import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PERMISSION_MAP = {
  "/master": "masterSetup",
  "/batches": "batches",
  "/enquiries": "enquiries",
  "/attendance": "attendance",
  "/expenses": "expenses",
  "/reports": "reports",
};

function ProtectedRoute({ children, path }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    if (path?.startsWith("/students") === false && path?.startsWith("/admin")) {
      return <Navigate to="/dashboard" replace />;
    }
    const requiredKey = PERMISSION_MAP[path];
    if (requiredKey && !user.permissions?.[requiredKey]) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;