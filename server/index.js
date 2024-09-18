import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/myLoginRegisterDB")
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Routes

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
// Register Route
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ email: email });
  
      if (existingUser) {
        return res.status(400).send({ message: "User already registered" });
      }
  
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.status(201).send({ message: "Successfully Registered" });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).send({ message: "Error during registration", error: err.message });
    }
  });
  

// Start the server
app.listen(9002, () => {
  console.log("Server started at port 9002");
});
