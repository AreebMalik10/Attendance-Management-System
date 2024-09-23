import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true } // 'Present' or 'Absent'
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
