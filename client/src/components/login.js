import React, { useState } from 'react';
import './css/login.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Login({ setLoginUser }) { // Changed prop name

    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    // Login function
    const login = () => { // Removed destructuring as it was incorrect
        axios
            .post("http://localhost:9002/login", user)
            .then((res) => {
                console.log("Response:", res.data);
                // Handle successful login
                if (res.data.message === "Login Successfully") {
                    alert("Login successful");
                    setLoginUser(res.data.user); // Fixed capitalization
                    navigate("/"); // Navigate to home path as per App.js

                } else {
                    alert(res.data.message); // Show error message from server
                }
            })
            .catch((error) => {
                console.error("There was an error logging in!", error);
                alert("Login failed: " + (error.response?.data?.message || error.message));
            });
    };

    return (
        <div className='login'>
            <h1>Login</h1>
            <input
                type="text"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder='Enter your Email'
            />
            <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder='Enter your Password'
            />
            <div className='button' onClick={login}>Login</div>
            <div>or</div>
            <div className='button' onClick={() => navigate("/register")}>Register</div>
        </div>
    );
}
