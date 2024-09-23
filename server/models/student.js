// models/student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true } // unique ID
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
