import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

const LoginPage = lazy(() => import("./login/components/LoginPage"));
const Dashboard = lazy(() => import("./planner/Dashboard"));

function App() {
  const location = useLocation();

  return (
    <div className="app-wrapper">
      {/* {location.pathname !== "/login" && <Menu />} */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
