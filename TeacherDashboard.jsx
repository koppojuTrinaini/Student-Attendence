import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, ClipboardList, Users, CalendarDays, Plus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from './api';
import { clearRole, clearToken, getRole } from './auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance', 'createClass', 'addStudent', 'report'
  const [newClassName, setNewClassName] = useState('');
  const [creatingClass, setCreatingClass] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', rollNo: '', parentMobileNumber: '' });
  const [addingStudent, setAddingStudent] = useState(false);
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await api.get('/teacher/classes');
      setClasses(response.data);
    } catch (err) {
      toast.error('Failed to load classes');
    }
  };

  const selectClass = async (classItem) => {
    setSelectedClass(classItem);
    try {
      const response = await api.get(`/teacher/class/${classItem.id}/students`);
      setStudents(response.data);
      setAttendance(response.data.reduce((acc, student) => ({ ...acc, [student.id]: 'Present' }), {}));
      setReport(null);
      setActiveTab('attendance');
    } catch (err) {
      toast.error('Failed to load students');
    }
  };

  const toggleStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/teacher/attendance', {
        classId: selectedClass.id,
        attendances: students.map((student) => ({ studentId: student.id, status: attendance[student.id] || 'Absent' })),
      });
      toast.success('Attendance saved successfully');
      
      // Fetch attendance report
      const reportResponse = await api.get(`/teacher/attendance/report/${selectedClass.id}`);
      setReport(reportResponse.data);
      setActiveTab('report');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      toast.error('Please enter a class name');
      return;
    }
    setCreatingClass(true);
    try {
      await api.post('/teacher/classes', { name: newClassName });
      toast.success('Class created successfully');
      setNewClassName('');
      loadClasses();
      setActiveTab('attendance');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create class');
    } finally {
      setCreatingClass(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedClass) {
      toast.error('Please select a class first');
      return;
    }
    if (!newStudent.name.trim() || !newStudent.email.trim() || !newStudent.rollNo.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setAddingStudent(true);
    try {
      await api.post('/teacher/students', {
        classId: selectedClass.id,
        ...newStudent
      });
      toast.success('Student added successfully');
      setNewStudent({ name: '', email: '', rollNo: '', parentMobileNumber: '' });
      selectClass(selectedClass); // Reload students
      setActiveTab('attendance');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add student');
    } finally {
      setAddingStudent(false);
    }
  };


  const logout = () => {
    clearToken();
    clearRole();
    navigate('/teacher/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl shadow-slate-950/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-400">Teacher dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold">Welcome back, teacher.</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">Manage your classes, students, and mark attendance.</p>
          </div>
          <button onClick={logout} className="rounded-full border border-white/10 bg-fuchsia-600 px-6 py-3 text-white font-semibold hover:bg-fuchsia-700 transition">Logout</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-lg shadow-slate-950/10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-400">Your classes</p>
              <button 
                onClick={() => setActiveTab('createClass')} 
                className="rounded-full bg-fuchsia-600 p-2 hover:bg-fuchsia-700 transition"
                title="Create new class">
                <Plus size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {classes.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/80 p-6 text-center">
                  <p className="text-slate-400 text-sm">No classes yet. Create one to get started!</p>
                </div>
              ) : (
                classes.map((classItem) => (
                  <button
                    key={classItem.id}
                    onClick={() => {
                      selectClass(classItem);
                      setActiveTab('attendance');
                    }}
                    className={`w-full rounded-3xl border p-4 text-left transition ${selectedClass?.id === classItem.id ? 'bg-fuchsia-600/15 border-fuchsia-500 text-white' : 'bg-slate-950/80 border-white/10 text-slate-200 hover:bg-slate-900'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">{classItem.name}</p>
                        <p className="text-sm text-slate-400 mt-1">{classItem.students?.length || 0} students</p>
                      </div>
                      <CalendarDays size={20} className="text-fuchsia-400" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-lg shadow-slate-950/10">
            {/* Tab buttons */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
              {selectedClass && (
                <>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'attendance' ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => setActiveTab('addStudent')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'addStudent' ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                    Add Student
                  </button>
                  {report && (
                    <button
                      onClick={() => setActiveTab('report')}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'report' ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                      Report
                    </button>
                  )}
                </>
              )}
              {!selectedClass && activeTab !== 'createClass' && (
                <button
                  onClick={() => setActiveTab('createClass')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'createClass' ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                  Create Class
                </button>
              )}
              {activeTab === 'createClass' && (
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
                  Back
                </button>
              )}
            </div>

            {/* Create Class Tab */}
            {activeTab === 'createClass' && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-400">Create new class</p>
                  <h2 className="mt-2 text-3xl font-semibold">Add a class</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Class Name</label>
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="e.g., 10th Grade - A"
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none transition"
                    />
                  </div>
                  <button
                    onClick={handleCreateClass}
                    disabled={creatingClass}
                    className="w-full rounded-3xl bg-fuchsia-600 px-6 py-4 text-white font-semibold shadow-xl shadow-fuchsia-500/20 hover:bg-fuchsia-700 transition disabled:opacity-70">
                    {creatingClass ? 'Creating...' : 'Create Class'}
                  </button>
                </div>
              </div>
            )}

            {/* Add Student Tab */}
            {activeTab === 'addStudent' && selectedClass && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-400">Add student</p>
                  <h2 className="mt-2 text-3xl font-semibold">{selectedClass.name}</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Student Name</label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="student@school.com"
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Roll Number</label>
                    <input
                      type="text"
                      value={newStudent.rollNo}
                      onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                      placeholder="e.g., 001"
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Parent Mobile Number <span className="text-slate-500">(optional)</span></label>
                    <input
                      type="tel"
                      value={newStudent.parentMobileNumber}
                      onChange={(e) => setNewStudent({ ...newStudent, parentMobileNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none transition"
                    />
                  </div>
                  <button
                    onClick={handleAddStudent}
                    disabled={addingStudent}
                    className="w-full rounded-3xl bg-fuchsia-600 px-6 py-4 text-white font-semibold shadow-xl shadow-fuchsia-500/20 hover:bg-fuchsia-700 transition disabled:opacity-70">
                    {addingStudent ? 'Adding...' : 'Add Student'}
                  </button>
                </div>
              </div>
            )}

            {/* Attendance Report Tab */}
            {activeTab === 'report' && report && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-400">Attendance Report</p>
                  <h2 className="mt-2 text-3xl font-semibold">{selectedClass.name}</h2>
                  <p className="text-slate-400 mt-2">{new Date(report.date).toLocaleDateString()}</p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                    <p className="text-sm text-emerald-300 font-semibold">Present</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-2">{report.present.length}</p>
                  </div>
                  <div className="rounded-3xl bg-rose-500/10 border border-rose-500/20 p-4">
                    <p className="text-sm text-rose-300 font-semibold">Absent</p>
                    <p className="text-3xl font-bold text-rose-400 mt-2">{report.absent.length}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-700/50 border border-white/10 p-4">
                    <p className="text-sm text-slate-300 font-semibold">Total</p>
                    <p className="text-3xl font-bold text-white mt-2">{report.total}</p>
                  </div>
                </div>

                {/* Present List */}
                {report.present.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 size={20} /> Present Students
                    </h3>
                    <div className="space-y-2">
                      {report.present.map((student) => (
                        <div key={student.id} className="rounded-3xl border border-emerald-500/20 bg-slate-950/80 p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">{student.name}</p>
                            <p className="text-slate-400 text-sm">Roll: {student.rollNo}</p>
                          </div>
                          <CheckCircle2 size={24} className="text-emerald-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Absent List */}
                {report.absent.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
                      <AlertCircle size={20} /> Absent Students
                    </h3>
                    <div className="space-y-2">
                      {report.absent.map((student) => (
                        <div key={student.id} className="rounded-3xl border border-rose-500/20 bg-slate-950/80 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-white">{student.name}</p>
                              <p className="text-slate-400 text-sm">Roll: {student.rollNo}</p>
                            </div>
                            <AlertCircle size={24} className="text-rose-500" />
                          </div>
                          {student.parentMobileNumber && (
                            <p className="text-xs text-slate-500">Parent: {student.parentMobileNumber}</p>
                          )}
                        </div>
                      ))}
                    </div>

                        {/* List of absent parents' mobile numbers */}
                        <div className="space-y-2 mt-4">
                          <h4 className="text-sm text-slate-400">Absent Parents' Numbers</h4>
                          <div className="rounded-3xl border border-rose-500/10 bg-slate-950/80 p-4">
                            {report.absent.filter(s => s.parentMobileNumber).length === 0 ? (
                              <p className="text-sm text-slate-400">No parent numbers available for absent students.</p>
                            ) : (
                              <ul className="list-disc list-inside space-y-1 text-sm text-white">
                                {report.absent.filter(s => s.parentMobileNumber).map((s) => (
                                  <li key={s.id}>{s.parentMobileNumber}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                  </div>
                )}

                {report.absent.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-4" />
                    <p className="text-slate-300 font-semibold">Perfect Attendance!</p>
                    <p className="text-slate-400 text-sm mt-1">All students are present today.</p>
                  </div>
                )}
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                {selectedClass ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-400">Attendance</p>
                        <h2 className="mt-2 text-3xl font-semibold">{selectedClass.name}</h2>
                      </div>
                      <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-slate-300">{students.length} students</div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-800/90 p-4">
                        <p className="text-sm text-slate-400">Today</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-800/90 p-4">
                        <p className="text-sm text-slate-400">Attendance mode</p>
                        <p className="mt-2 text-2xl font-semibold text-white">Auto-ready</p>
                      </div>
                    </div>

                    {students.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/80 p-8 text-center">
                        <Users size={32} className="mx-auto text-fuchsia-400 mb-4" />
                        <p className="text-slate-400">No students in this class yet. Add students to begin.</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {students.map((student) => (
                            <div key={student.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 grid gap-4 sm:grid-cols-[1fr_auto] items-center">
                              <div>
                                <p className="font-semibold text-white">{student.name}</p>
                                <p className="text-slate-400 text-sm">Roll: {student.rollNo}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleStatus(student.id, 'Present')}
                                  className={`rounded-full px-4 py-2 text-sm font-semibold ${attendance[student.id] === 'Present' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-emerald-500/90'} transition`}>
                                  Present
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleStatus(student.id, 'Absent')}
                                  className={`rounded-full px-4 py-2 text-sm font-semibold ${attendance[student.id] === 'Absent' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-rose-500/90'} transition`}>
                                  Absent
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button onClick={handleSave} disabled={saving} className="w-full rounded-3xl bg-fuchsia-600 px-6 py-4 text-white font-semibold shadow-xl shadow-fuchsia-500/20 hover:bg-fuchsia-700 transition disabled:opacity-70">
                          {saving ? 'Saving...' : 'Save attendance'}
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/80 p-8 text-center">
                    <Bell size={32} className="mx-auto text-fuchsia-400 mb-4" />
                    <p className="text-slate-400">Choose a class from the left to begin marking attendance.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
