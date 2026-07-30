import { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, BookOpen, Pencil, Trash2, X } from "lucide-react";

function MasterSetup() {
  const [courses, setCourses] = useState([]);
  const [subCourses, setSubCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showSubForm, setShowSubForm] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [subForm, setSubForm] = useState({ course: "", name: "" });
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [editCourseName, setEditCourseName] = useState("");
  const [editSubForm, setEditSubForm] = useState({ course: "", name: "" });

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

  const startEditCourse = (c) => {
    setEditingCourse(c._id);
    setEditCourseName(c.name);
  };

  const saveEditCourse = async (id) => {
    await api.patch(`/courses/${id}`, { name: editCourseName });
    setEditingCourse(null);
    loadAll();
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course? All sub-courses and batches under it will also be deleted.")) return;
    await api.delete(`/courses/${id}`);
    loadAll();
  };

  const startEditSub = (sc) => {
    setEditingSub(sc._id);
    setEditSubForm({ course: sc.course?._id || "", name: sc.name });
  };

  const saveEditSub = async (id) => {
    await api.patch(`/subcourses/${id}`, editSubForm);
    setEditingSub(null);
    loadAll();
  };

  const deleteSub = async (id) => {
    if (!window.confirm("Delete this sub-course? Batches under it will remain but be unlinked.")) return;
    await api.delete(`/subcourses/${id}`);
    loadAll();
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
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
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
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={15} className="text-indigo-600" />
                  </div>
                  {editingCourse === c._id ? (
                    <>
                      <input
                        value={editCourseName}
                        onChange={(e) => setEditCourseName(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => saveEditCourse(c._id)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-900 flex-1">{c.name}</p>
                      <button
                        onClick={() => startEditCourse(c)}
                        className="text-gray-300 hover:text-indigo-600"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteCourse(c._id)}
                        className="text-gray-300 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SubCourses */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
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
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={15} className="text-amber-600" />
                  </div>
                  {editingSub === sc._id ? (
                    <>
                      <div className="flex-1 space-y-2">
                        <select
                          value={editSubForm.course}
                          onChange={(e) => setEditSubForm({ ...editSubForm, course: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {courses.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <input
                          value={editSubForm.name}
                          onChange={(e) => setEditSubForm({ ...editSubForm, name: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        onClick={() => saveEditSub(sc._id)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingSub(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{sc.name}</p>
                        <p className="text-xs text-gray-400">{sc.course?.name}</p>
                      </div>
                      <button
                        onClick={() => startEditSub(sc)}
                        className="text-gray-300 hover:text-indigo-600"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteSub(sc._id)}
                        className="text-gray-300 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
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