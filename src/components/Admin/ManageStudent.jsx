import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const ManageStudent = () => {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  const [newStudent, setNewStudent] = useState({ name: '', email: '', grade: '' });
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.grade) return;
    const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
    setStudents([...students, { ...newStudent, id: newId }]);
    setNewStudent({ name: '', email: '', grade: '' });
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
  };

  const handleUpdateStudent = () => {
    setStudents(students.map(student => 
      student.id === editingStudent.id ? editingStudent : student
    ));
    setEditingStudent(null);
  };

  return (
    <div className="p-6">
      {/* Back to Admin Dashboard NavLink */}
      <NavLink
        to="/Admin"
        className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Admin Dashboard
      </NavLink>

      <h2 className="text-2xl font-semibold mb-6">Manage Students</h2>

      {/* Add Student Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Student</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Grade"
            value={newStudent.grade}
            onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddStudent}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Student
          </button>
        </div>
      </div>

      {/* Edit Student Form */}
      {editingStudent && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Student</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={editingStudent.name}
              onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={editingStudent.email}
              onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={editingStudent.grade}
              onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleUpdateStudent}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update Student
            </button>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => (
          <div key={student.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{student.name}</h3>
            <p className="text-gray-600 mb-2"><strong>Email:</strong> {student.email}</p>
            <p className="text-gray-600 mb-4"><strong>Grade:</strong> {student.grade}</p>
            <div className="flex space-x-4">
              <Link
                to={`/student-details/${student.id}`}
                className="text-blue-500 hover:underline"
              >
                View
              </Link>
              <button
                onClick={() => handleEditStudent(student)}
                className="text-yellow-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteStudent(student.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageStudent;