import React, { Suspense, lazy, use, useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import CalendarPage from "./calendar/components/CalendarPage";
import "./styles.scss";

const ChatWindow = lazy(() => import("./dashboard/components/ChatWindow"));
const Sidebar = lazy(() => import("./sidebar/components/Sidebar"));
const TasksPage = lazy(() => import("./tasks/components/TasksPage"));
function Dashboard() {
  const location = useLocation();

  const [isActive, setIsActive] = useState(false);
  const [activePage, setActivePage] = useState("chat");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/current-user");
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="dashboard-wrapper main-page">
      <Sidebar
        user={user}
        activePage={activePage}
        setActivePage={setActivePage}
        isActive={isActive}
        setIsActive={setIsActive}
      />
      <main className="main-content">
        {activePage === "chat" && (
          <div className="page-placeholder">
            <ChatWindow />
          </div>
        )}
        {activePage === "calendar" && (
          <div className="page-placeholder">
            <CalendarPage
              setActivePage={setActivePage}
              setSelectedDate={setSelectedDate}
            />
          </div>
        )}
        {activePage === "dayplan" && (
          <div className="page-placeholder">План на день</div>
        )}
        {activePage === "tasks" && (
          <div className="page-placeholder">
            <TasksPage selectedDate={selectedDate} />
          </div>
        )}
        {activePage === "analytics" && (
          <div className="page-placeholder">Аналітика</div>
        )}
        {activePage === "archived" && (
          <div className="page-placeholder">Архів</div>
        )}
        {activePage === "settings" && (
          <div className="page-placeholder">Налаштування</div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
