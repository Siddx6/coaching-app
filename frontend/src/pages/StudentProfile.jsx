/* eslint-disable react-hooks/static-components */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, FileText } from "lucide-react";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    api.get("/students").then((res) => {
      const s = res.data.find((s) => s._id === id);
      setStudent(s);
    });
  }, [id]);

  if (!student) return <div className="p-8">Loading...</div>;

  const Row = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <Icon size={16} className="text-gray-400 flex-shrink-0" />
      <span className="text-sm text-gray-500 w-32 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => navigate("/students")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={16} />
        Back to Students
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl">
        <div className="flex items-center gap-5 mb-8">
          {student.photoUrl ? (
            <img src={student.photoUrl} alt={student.name} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
              {student.name?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-sm text-gray-400">{student.memberId}</p>
            <span
              className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                student.status === "live"
                  ? "bg-green-50 text-green-700"
                  : student.status === "demo"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {student.status}
            </span>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-gray-700 mb-2">Contact Details</h2>
        <div className="mb-6">
          <Row icon={Phone} label="Mobile" value={student.mobile} />
          <Row icon={Mail} label="Email" value={student.email} />
          <Row icon={MapPin} label="Address" value={student.address} />
        </div>

        <h2 className="text-sm font-semibold text-gray-700 mb-2">Academic Details</h2>
        <div className="mb-6">
          <Row icon={User} label="Batch" value={student.batch?.name} />
          <Row icon={Calendar} label="Join Date" value={student.joinDate ? new Date(student.joinDate).toLocaleDateString() : null} />
          <Row icon={Calendar} label="End Date" value={student.endDate ? new Date(student.endDate).toLocaleDateString() : null} />
          <Row icon={User} label="Gender" value={student.gender} />
        </div>

        {student.documents?.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Documents</h2>
            <div className="flex flex-wrap gap-2">
              {student.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  <FileText size={13} />
                  Document {i + 1}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;