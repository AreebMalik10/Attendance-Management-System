import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Fetch all attendance data
  useEffect(() => {
    axios.get("http://localhost:9002/admin/attendance/view")
      .then(res => {
        setAttendanceData(res.data); // Assuming res.data is an array of attendance records
      })
      .catch(err => console.error("Error fetching attendance records", err));
  }, []);

  // Fetch all leave requests
  useEffect(() => {
    axios.get("http://localhost:9002/admin/leaves")
      .then(res => {
        setLeaveRequests(res.data); // Assuming res.data is an array of leave requests
      })
      .catch(err => console.error("Error fetching leave requests", err));
  }, []);

  // Handle Attendance Deletion
  const deleteAttendance = (id) => {
    axios.delete(`http://localhost:9002/admin/attendance/delete/${id}`)
      .then(() => {
        setAttendanceData(attendanceData.filter(item => item._id !== id));
        alert("Attendance deleted successfully");
      })
      .catch(err => alert("Error deleting attendance"));
  };

  // Handle Attendance Editing (Toggle status between 'Present' and 'Absent')
  const editAttendance = (id) => {
    // First, update the state to reflect the change locally
    const updatedAttendance = attendanceData.map(attendance =>
      attendance._id === id
        ? { ...attendance, status: attendance.status === 'Present' ? 'Absent' : 'Present' }
        : attendance
    );

    // Update the state with the new attendance status
    setAttendanceData(updatedAttendance);

    // Then send the updated status to the backend
    const updatedStatus = updatedAttendance.find(item => item._id === id).status;

    axios.put(`http://localhost:9002/admin/attendance/edit/${id}`, { status: updatedStatus })
      .then(() => {
        console.log("Attendance status updated on the server");
      })
      .catch(err => {
        alert("Error updating attendance status on the server");
        // Optional: Rollback the UI if server update fails
        setAttendanceData(attendanceData); // Rollback the change on failure
      });
  };

  // Handle Leave Request Deletion
  const deleteLeaveRequest = (id) => {
    axios.delete(`http://localhost:9002/admin/leaves/delete/${id}`)
      .then(() => {
        setLeaveRequests(leaveRequests.filter(item => item._id !== id));
        alert("Leave request deleted successfully");
      })
      .catch(err => alert("Error deleting leave request"));
  };

  return (
    <div className="container mx-auto my-6">
      <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>
      <table className="min-w-full bg-white border border-gray-300 shadow-md mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2">Student ID</th>
            <th className="py-2 px-4 border-b-2">Student Name</th>
            <th className="py-2 px-4 border-b-2">Date</th>
            <th className="py-2 px-4 border-b-2">Attendance Status</th>
            <th className="py-2 px-4 border-b-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((attendance) => (
            <tr key={attendance._id} className="text-center">
              <td className="py-2 px-4 border-b">{attendance.studentId}</td>
              <td className="py-2 px-4 border-b">{attendance.studentName}</td>
              <td className="py-2 px-4 border-b">{attendance.date}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`py-1 px-3 rounded-full text-white ${
                    attendance.status === 'Present' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {attendance.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b flex justify-center gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                  onClick={() => editAttendance(attendance._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                  onClick={() => deleteAttendance(attendance._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2">Student ID</th>
            <th className="py-2 px-4 border-b-2">Student Name</th>
            <th className="py-2 px-4 border-b-2">Leave Date</th>
            <th className="py-2 px-4 border-b-2">Reason</th>
            <th className="py-2 px-4 border-b-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leave) => (
            <tr key={leave._id} className="text-center">
              <td className="py-2 px-4 border-b">{leave.studentId}</td>
              <td className="py-2 px-4 border-b">{leave.studentName}</td>
              <td className="py-2 px-4 border-b">{leave.date}</td>
              <td className="py-2 px-4 border-b">{leave.reason}</td>
              <td className="py-2 px-4 border-b flex justify-center gap-2">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                  onClick={() => deleteLeaveRequest(leave._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
