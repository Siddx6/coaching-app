import { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, BookOpen } from "lucide-react";

function MasterSetup() {
  const [courses, setCourses] = useState([]);
  const [subCourses, setSubCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showSubForm, setShowSubForm] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [subForm, setSubForm] = useState({ course: "", name: "" });
  const [error, setError] = useState("");

  const loadAll = () => {
    setLoading(true);
    Promise.all([api.get("/courses"), api.get("/subcourses")])
      .then(([c, sc]) => {
        setCourses(c.data);
        setSubCourses(sc.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/courses", { name: courseName });
      setCourseName("");
      setShowCourseForm(false);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add course");
    }
  };

  const handleAddSubCourse = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/subcourses", subForm);
      setSubForm({ course: "", name: "" });
      setShowSubForm(false);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add sub-course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Master Setup</h1>
        <p className="text-sm text-gray-400">Manage courses and sub-courses</p>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 rounded-lg py-2 px-3 mb-6 max-w-lg">{error}</p>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Courses</h2>
            <button
              onClick={() => setShowCourseForm(!showCourseForm)}
              className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus size={14} />
              Add Course
            </button>
          </div>

          {showCourseForm && (
            <form
              onSubmit={handleAddCourse}
              className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex gap-2"
            >
              <input
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Course name"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-400 text-sm">No courses yet.</p>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {courses.map((c, i) => (
                <div
                  key={c._id}
                  className={`flex items-center gap-3 px-5 py-3 ${
                    i !== courses.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <BookOpen size={15} className="text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SubCourses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Sub-Courses</h2>
            <button
              onClick={() => setShowSubForm(!showSubForm)}
              className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus size={14} />
              Add Sub-Course
            </button>
          </div>

          {showSubForm && (
            <form
              onSubmit={handleAddSubCourse}
              className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 space-y-3"
            >
              <select
                value={subForm.course}
                onChange={(e) => setSubForm({ ...subForm, course: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  value={subForm.name}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                  placeholder="Sub-course name"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : subCourses.length === 0 ? (
            <p className="text-gray-400 text-sm">No sub-courses yet.</p>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {subCourses.map((sc, i) => (
                <div
                  key={sc._id}
                  className={`flex items-center gap-3 px-5 py-3 ${
                    i !== subCourses.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <BookOpen size={15} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sc.name}</p>
                    <p className="text-xs text-gray-400">{sc.course?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MasterSetup;