import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || { data: [] }; // Get the attendance data passed through state

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Attendance Records</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => navigate('/')}
        >
          Back
        </button>
      </header>

      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Student Name</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr key={index}>
                <td className="border px-6 py-4">{record.studentName}</td>
                <td className="border px-6 py-4">{record.date}</td>
                <td className={`border px-6 py-4 ${record.status === 'Present' ? 'text-green-600' : record.status === 'Absent' ? 'text-red-600' : ''}`}>
                  {record.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAttendance;
