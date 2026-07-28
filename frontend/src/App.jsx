import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StudentAuthProvider } from "./context/StudentAuthContext";
import StudentLogin from "./pages/StudentLogin";
import StudentPortal from "./pages/StudentPortal";
import StudentAttendance from "./pages/StudentAttendance";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentNavbar from "./components/StudentNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import Batches from "./pages/Batches";
import StudentDetail from "./pages/StudentDetail";
import EditStudent from "./pages/EditStudent";
import Enquiries from "./pages/Enquiries";
import Attendance from "./pages/Attendance";
import Expenses from "./pages/Expenses";
import AdminUsers from "./pages/AdminUsers";
import Reports from "./pages/Reports";
import MasterSetup from "./pages/MasterSetup";
import ManagePermissions from "./pages/ManagePermissions";
import Notices from "./pages/Notices";
import ProfileSettings from "./pages/ProfileSettings";
import StudentProfile from "./pages/StudentProfile";
import EnrollmentFees from "./pages/EnrollmentFees";

function AppLayout({ collapsed, setCollapsed }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <div className={isLoginPage ? "" : `transition-all duration-300 ease-in-out ${collapsed ? "ml-20" : "ml-60"}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute path="/dashboard">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute path="/students">
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/add"
            element={
              <ProtectedRoute path="/students/add">
                <AddStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute path="/students/:id">
                <StudentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id/profile"
            element={
              <ProtectedRoute path="/students/:id/profile">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id/edit"
            element={
              <ProtectedRoute path="/students/:id/edit">
                <EditStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/master"
            element={
              <ProtectedRoute path="/master">
                <MasterSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/batches"
            element={
              <ProtectedRoute path="/batches">
                <Batches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiries"
            element={
              <ProtectedRoute path="/enquiries">
                <Enquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute path="/attendance">
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute path="/expenses">
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute path="/admin/users">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/permissions"
            element={
              <ProtectedRoute path="/admin/permissions">
                <ManagePermissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notices"
            element={
              <ProtectedRoute path="/notices">
                <Notices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrollment-fees"
            element={
              <ProtectedRoute path="/enrollment-fees">
                <EnrollmentFees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute path="/profile">
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute path="/reports">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AuthProvider>
      <StudentAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/student/login" element={<StudentLogin />} />
            <Route
              path="/student/dashboard"
              element={
                <StudentPortalGuard>
                  <StudentPortal />
                </StudentPortalGuard>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <StudentPortalGuard>
                  <StudentAttendance />
                </StudentPortalGuard>
              }
            />
            <Route
              path="/student/profile"
              element={
                <StudentPortalGuard>
                  <StudentProfilePage />
                </StudentPortalGuard>
              }
            />
            <Route path="/*" element={<AppLayout collapsed={collapsed} setCollapsed={setCollapsed} />} />
          </Routes>
        </BrowserRouter>
      </StudentAuthProvider>
    </AuthProvider>
  );
}

function StudentPortalGuard({ children }) {
  const stored = localStorage.getItem("student");
  if (!stored) return <Navigate to="/student/login" replace />;
  return (
    <>
      <StudentNavbar />
      {children}
    </>
  );
}

export default App;