import multer from 'multer';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Attendance from './models/Attendance.js';
import User from './models/User.js';
import LeaveRequest from './models/leaveRequest.js';


const app = express();
const PORT = 9002;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/myLoginRegisterDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Define storage for image uploads (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });

// Image upload route
app.post('/user/uploadImage', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }
  res.status(200).send({ message: "Image uploaded successfully", filePath: req.file.path });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfully", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error during login", error: err });
  }
});

// Register Route
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "User already registered" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).send({ message: "Successfully Registered" });
  } catch (err) {
    res.status(500).send({ message: "Error during registration", error: err.message });
  }
});

// Add Student Route
app.post("/student/add", async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).send({ message: "ID and name are required" });
  }

  try {
    const newStudent = new User({ id, name });
    await newStudent.save();
    res.status(201).send({ message: "Student added successfully" });
  } catch (err) {
    console.error('Error adding student:', err); // Log the error
    res.status(500).send({ message: "Error adding student", error: err.message });
  }
});





// Save Attendance Route
app.post("/attendance/save", async (req, res) => {
  const { attendanceData } = req.body;

  if (!attendanceData || attendanceData.length === 0) {
    return res.status(400).send({ message: "No attendance data to save" });
  }

  try {
    await Attendance.insertMany(attendanceData);
    res.status(201).send({ message: "Attendance saved successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error saving attendance", error: err.message });
  }
});

// View Attendance Route
app.get("/attendance/view/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ studentId });
    res.status(200).send(attendanceRecords);
  } catch (err) {
    res.status(500).send({ message: "Error fetching attendance", error: err.message });
  }
});

// Add Student Route
app.post("/student/add", async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).send({ message: "ID and name are required" });
  }

  try {
    const newStudent = new User({ id, name });
    await newStudent.save();
    res.status(201).send({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error adding student", error: err.message });
  }
});

// Update Profile Picture Route
app.post("/user/updateProfilePicture", async (req, res) => {
  const { userId, pictureUrl } = req.body;

  try {
    await User.updateOne({ _id: userId }, { profilePicture: pictureUrl });
    res.status(200).send({ message: "Profile picture updated successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error updating profile picture", error: err.message });
  }
});

// Submit Leave Request Route
app.post("/leave/request", async (req, res) => {
  const { studentId, reason } = req.body;

  if (!studentId || !reason) {
    return res.status(400).send({ message: "Student ID and reason are required" });
  }

  try {
    const newRequest = new LeaveRequest({ studentId, reason });
    await newRequest.save();
    res.status(201).send({ message: "Leave request submitted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error submitting leave request", error: err.message });
  }
});

//                    Admin Panel Work

// Fetch all attendance records
app.get("/admin/attendance/view", async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();
    res.status(200).json(attendanceRecords);  // Changed to .json() for consistency with typical REST APIs
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Error fetching attendance", error: err.message });
  }
});

// Update attendance (admin can edit)
app.put("/admin/attendance/edit/:id", async (req, res) => {
  const { id } = req.params;
  const updatedAttendance = req.body;

  try {
    const result = await Attendance.findByIdAndUpdate(id, updatedAttendance, { new: true });
    if (!result) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({ message: "Attendance updated successfully", data: result });
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({ message: "Error updating attendance", error: err.message });
  }
});

// Delete attendance (admin can delete)
app.delete("/admin/attendance/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Attendance.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (err) {
    console.error("Error deleting attendance:", err);
    res.status(500).json({ message: "Error deleting attendance", error: err.message });
  }
});

// View all leave requests (admin)
app.get("/admin/leaves", async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    res.status(200).send(leaveRequests);
  } catch (err) {
    console.error("Error fetching leave requests:", err);
    res.status(500).send({ message: "Error fetching leave requests", error: err.message });
  }
});


// Delete leave request (admin)
app.delete("/admin/leaves/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await LeaveRequest.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (err) {
    console.error("Error deleting leave request:", err);
    res.status(500).json({ message: "Error deleting leave request", error: err.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
