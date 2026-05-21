import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

const LoginPage = lazy(() => import("./login/components/LoginPage"));

function App() {
  const location = useLocation();

  return (
    <div className="app-wrapper">
      {/* {location.pathname !== "/login" && <Menu />} */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* <Route path="/main-page" element={<MainPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/task-list" element={<TasksPage />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </div>
  );
}

export default App;
