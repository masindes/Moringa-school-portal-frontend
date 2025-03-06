import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://moringa-school-portal-backend.onrender.com';
const API_URL = `${API_BASE_URL}/students`;

// Create an axios instance with the access token
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Get the token from localStorage
    },
});

const StudentDetails = () => {
    const { id } = useParams(); // Get the student ID from the URL
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStudent, setEditedStudent] = useState({
        name: '',
        email: '',
        grade: '',
        currentPhase: '',
        course: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch student details from the API
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                console.log(`Fetching student with ID: ${id}`); // Debugging
                const response = await axiosInstance.get(`${API_URL}/${id}`); // Use axiosInstance
                console.log('API Response:', response.data); // Debugging
                if (!response.data) {
                    throw new Error('No data received from the server.');
                }
                setStudent(response.data);
                setEditedStudent(response.data);
            } catch (error) {
                console.error('Error fetching student:', error); // Debugging
                setError(error.message);
                toast.error(error.response?.data?.message || 'Failed to fetch student details.');
                navigate('/manage-student'); // Redirect to manage students page
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id, navigate]);

    // Handle updating student details
    const handleUpdateStudent = async () => {
        if (
            !editedStudent.name ||
            !editedStudent.email ||
            !editedStudent.grade ||
            !editedStudent.currentPhase ||
            !editedStudent.course
        ) {
            toast.error('All fields are required!');
            return;
        }

        try {
            await toast.promise(
                axiosInstance.patch(`${API_URL}/${id}`, editedStudent), // Use axiosInstance
                {
                    pending: 'Updating student...',
                    success: 'Student updated successfully!',
                    error: 'Failed to update student.',
                }
            );
            setStudent(editedStudent); // Update the displayed student data
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update student.');
        }
    };

    // Handle deleting a student
    const handleDeleteStudent = async () => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        try {
            await toast.promise(
                axiosInstance.delete(`${API_URL}/${id}`), // Use axiosInstance
                {
                    pending: 'Deleting student...',
                    success: 'Student deleted successfully!',
                    error: 'Failed to delete student.',
                }
            );
            navigate('/manage-student'); // Redirect to manage students page
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete student.');
        }
    };

    // Display loading state
    if (loading) {
        return <div className="text-center text-white p-6">Loading...</div>;
    }

    // Display error state
    if (error) {
        return <div className="text-center text-white p-6">{error}</div>;
    }

    // Display student details
    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <ToastContainer position="top-right" autoClose={3000} />
            <Link to="/manage-student" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
                &larr; Back to Manage Students
            </Link>

            <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {isEditing ? 'Edit Student' : student?.name || 'Student Details'}
                </h2>

                {isEditing ? (
                    // Edit mode
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={editedStudent.name}
                            onChange={(e) => setEditedStudent({ ...editedStudent, name: e.target.value })}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editedStudent.email}
                            onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Grade"
                            value={editedStudent.grade}
                            onChange={(e) => setEditedStudent({ ...editedStudent, grade: e.target.value })}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Current Phase"
                            value={editedStudent.currentPhase}
                            onChange={(e) => setEditedStudent({ ...editedStudent, currentPhase: e.target.value })}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
                        />
                        <select
                            value={editedStudent.course}
                            onChange={(e) => setEditedStudent({ ...editedStudent, course: e.target.value })}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                        >
                            <option value="">Select Course</option>
                            {['Software Engineering', 'Cyber Security', 'Data Science', 'Product Design', 'DevOps'].map(
                                (course) => (
                                    <option key={course} value={course}>
                                        {course}
                                    </option>
                                )
                            )}
                        </select>
                        <button
                            onClick={handleUpdateStudent}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Update Student
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    // View mode
                    <div>
                        <p className="mb-2">
                            <strong>Email:</strong> {student?.email || 'N/A'}
                        </p>
                        <p className="mb-2">
                            <strong>Grade:</strong> {student?.grade || 'N/A'}
                        </p>
                        <p className="mb-2">
                            <strong>Course:</strong> {student?.course || 'N/A'}
                        </p>
                        <p className="mb-4">
                            <strong>Current Phase:</strong> {student?.currentPhase || 'N/A'}
                        </p>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDeleteStudent}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDetails;