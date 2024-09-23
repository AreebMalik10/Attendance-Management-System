import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('LeaveRequest', leaveRequestSchema);
