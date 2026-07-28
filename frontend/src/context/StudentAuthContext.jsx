/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import api from "../services/api";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    const stored = localStorage.getItem("student");
    return stored ? JSON.parse(stored) : null;
  });

  const studentLogin = async (memberId, password) => {
    const res = await api.post("/student-auth/login", { memberId, password });
    localStorage.setItem("studentToken", res.data.token);
    localStorage.setItem("student", JSON.stringify(res.data.student));
    setStudent(res.data.student);
    return res.data.student;
  };

  const studentLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("student");
    setStudent(null);
  };

  return (
    <StudentAuthContext.Provider value={{ student, setStudent, studentLogin, studentLogout }}>
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => useContext(StudentAuthContext);