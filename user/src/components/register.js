import React, { useState } from 'react';
import './css/register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    reEnterPassword: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Register user
  const register = () => {
    const { name, email, password, reEnterPassword } = user;

    if (name && email && password && password === reEnterPassword) {
      axios
        .post("http://localhost:9002/register", { ...user, role: 'student' }) // Automatically set role as 'student'
        .then((res) => {
          console.log("Response:", res.data);
          alert("Registration successful");
        })
        .catch((error) => {
          console.error("There was an error registering!", error);
          alert("Registration failed: " + error.response?.data?.message || error.message);
        });
    } else {
      alert("Invalid input");
    }
  };

  return (
    <div className="login">
      <h1>Register</h1>
      <input
        type="text"
        name="name"
        value={user.name}
        onChange={handleChange}
        placeholder="Enter your Name"
      />
      <input
        type="text"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Enter your Email"
      />
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Enter your Password"
      />
      <input
        type="password"
        name="reEnterPassword"
        value={user.reEnterPassword}
        onChange={handleChange}
        placeholder="Re-enter your Password"
      />
      <div className="button" onClick={register}>
        Register
      </div>
      <div>or</div>
      <div className="button" onClick={() => navigate("/login")}>Login</div>
    </div>
  );
}
