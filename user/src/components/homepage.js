import React, { useState, useEffect } from 'react';
import './css/homepage.css';
import { useNavigate } from 'react-router-dom';

// Mock data for students
const initialStudents = [
  { id: '1', name: 'Muhammad Areeb' },
  { id: '2', name: 'Haseeb Ali' },
  { id: '3', name: 'Syed Sarmad Abbas' },
  { id: '4', name: 'Abdul Mateen Kundi' },
  { id: '5', name: 'Fakhar Abbas' },
  { id: '6', name: 'Abdullah bin Sohail' }
];

export default function Homepage({ setLoginUser, loggedInUserId }) {
  const [attendanceData, setAttendanceData] = useState({});
  const [students, setStudents] = useState(initialStudents);
  const [newStudentName, setNewStudentName] = useState('');
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    setLoginUser(null); // Clear user state
    navigate("/login"); // Redirect to login page
  };

  const handleAdminPage = () => {
    navigate("/adminPanel"); // Navigate to admin panel
  };

  // Initialize attendance data for the current date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const initialAttendance = students.reduce((acc, student) => {
      acc[student.id] = { date: today, status: 'Not Marked' };
      return acc;
    }, {});
    setAttendanceData(initialAttendance);
  }, [students]);

  // Handle marking attendance
  const handleMarkAttendance = (studentId, status) => {
    const today = new Date().toISOString().split('T')[0];
    const student = students.find(student => student.id === studentId);

    if (attendanceData[studentId]?.date === today && attendanceData[studentId]?.status !== 'Not Marked') {
      alert(`Attendance for ${student.name} has already been marked as ${attendanceData[studentId]?.status}.`);
      return;
    }

    setAttendanceData(prevState => ({
      ...prevState,
      [studentId]: { date: today, status }
    }));

    alert(`Attendance marked as ${status} for ${student.name}.`);
  };

  // Handle viewing attendance
  const handleViewAttendance = () => {
    navigate('/view-attendance', { state: { data: attendanceData } });
  };

  // Handle saving attendance to the backend
  const handleSaveAttendance = async () => {
    const attendanceToSave = students.map(student => ({
      studentId: student.id,
      studentName: student.name,
      date: attendanceData[student.id]?.date || new Date().toISOString().split('T')[0],
      status: attendanceData[student.id]?.status || 'Not Marked'
    })).filter(record => record.status && record.status !== 'Not Marked');

    if (attendanceToSave.length === 0) {
      alert('No attendance has been marked to save.');
      return;
    }

    try {
      const response = await fetch('http://localhost:9002/attendance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceData: attendanceToSave })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Attendance saved for ${attendanceToSave.length} student(s).`);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('An error occurred while saving attendance.');
    }
  };

  // Handle adding a new student
  const handleAddStudent = () => {
    if (!newStudentName) {
      alert("Please enter a student name.");
      return;
    }

    const newStudent = {
      id: (students.length + 1).toString(),
      name: newStudentName
    };

    setStudents(prevStudents => [...prevStudents, newStudent]);
    setNewStudentName(''); // Clear the input field after adding
  };



  // Handle viewing personal attendance
  const handleViewMyAttendance = async () => {
    try {
      const response = await fetch(`http://localhost:9002/attendance/view/${loggedInUserId}`);
      const records = await response.json();
      // Display records in a modal or alert for simplicity
      alert(JSON.stringify(records, null, 2));
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert('An error occurred while fetching attendance.');
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file); // 'image' should match the name used in multer

    try {
      const response = await fetch('http://localhost:9002/user/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText); // Throw an error if response is not ok
      }

      const data = await response.json();
      console.log('Image uploaded successfully:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Handle sending leave request
  const handleLeaveRequest = async () => {
    const reason = prompt("Enter reason for leave:");
    if (!reason) return;

    try {
      const response = await fetch('http://localhost:9002/leave/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: loggedInUserId, reason }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Leave request submitted successfully.");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('An error occurred while submitting leave request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Homepage</h1>

        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleAdminPage} // Navigate to admin page
          >
            Admin
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6">Attendance Dashboard</h2>

        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Enter student name"
            className="border rounded-lg p-2 flex-1"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleAddStudent} // Use the new function here
          >
            Add Student
          </button>


        </div>

        <div className="mb-6 flex space-x-4">
          <button
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            onClick={handleViewAttendance}
          >
            View All Attendance
          </button>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            onClick={handleSaveAttendance}
          >
            Save Attendance
          </button>

          <input
            type="file"
            onChange={handleProfilePictureUpload}
            className="border rounded-lg p-2"
          />
          <button
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
            onClick={handleLeaveRequest}
          >
            Send Request
          </button>
        </div>

        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Student ID</th>
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Attendance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="px-4 py-2">{student.id}</td>
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{attendanceData[student.id]?.status || 'Not Marked'}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2"
                    onClick={() => handleMarkAttendance(student.id, 'Present')}
                  >
                    Present
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleMarkAttendance(student.id, 'Absent')}
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
