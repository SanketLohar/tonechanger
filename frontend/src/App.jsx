// src/App.jsx
import React from "react";
import RewriterForm from "./components/RewriterForm";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Make sure Bootstrap is loaded

function App() {
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <RewriterForm />
    </div>
  );
}

export default App;
