import React, { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";
import Homepage from "./components/homepage";
import AdminPanel from "./components/adminPanel";
import ViewAttendance from "./components/viewAttendance"; // Import the new component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [user, setLoginUser] = useState(null); // Initialize state to null

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Conditional rendering for the root path */}
          <Route path="/" element={user ? <Homepage setLoginUser={setLoginUser} /> : <Login setLoginUser={setLoginUser} />} />
          
          {/* Direct routes for login and register */}
          <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
          <Route path="/register" element={<Register />} />

          {/* Add the new route for View Attendance */}
          <Route path="/view-attendance" element={<ViewAttendance />} />

          <Route path="/adminPanel" element={<AdminPanel />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
