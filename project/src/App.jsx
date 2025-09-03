import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, App as AntdApp } from "antd";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh", backgroundColor: "#fefdf6" }}>
        <AntdApp>
          <Content>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Content>
        </AntdApp>
      </Layout>
    </Router>
  );
}

export default App;
