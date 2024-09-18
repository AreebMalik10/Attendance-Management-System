import React, { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";
import Homepage from "./components/homepage";
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
