import { useState, useEffect } from "react";
import axios from "axios";
import { getNextSevenDays, getItemsForDay } from "../Helpers";
import { formatIsoTime } from "../../../date/FormatDateTime";
import TaskModal from "../../../modal/TaskModal";
// import { priorityColorMap } from "../Constants";
import "../styles/tasks-page.scss";
import classNames from "classnames";

const TasksPage = ({ selectedDate }) => {
  const [items, setItems] = useState([]);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    time: "",
    deadline: "",
  });

  const weekDays = getNextSevenDays(selectedDate);

  useEffect(() => {
    const fetchWeekData = async () => {
      try {
        const dateP = selectedDate
          ? new Date(selectedDate).toLocaleDateString("en-CA", {
              timeZone: "Europe/Kyiv",
            })
          : new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Kyiv" });

        const [tasksResponse, eventsResponse] = await Promise.all([
          axios.get("/api/tasks"),
          axios.get(`/api/events?startDate=${dateP}T00:00:00.000Z`),
        ]);

        const tasks = tasksResponse.data.map((t) => ({ ...t, type: "task" }));
        const events = eventsResponse.data.map((e) => ({
          ...e,
          type: "event",
        }));
        const allItems = [...tasks, ...events];

        setItems(allItems);
        console.log("ОСЬ ЦЕ ПРИЛІТАЄ З БАЗИ НА ТИЖДЕНЬ:", allItems);
      } catch (error) {
        console.error("Помилка завантаження даних з бази:", error);
      }
    };

    fetchWeekData();
  }, [selectedDate]);

  const handleCreateClick = () => {
    setEditTaskId(null);
    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      time: "",
      deadline: selectedDate || "",
    });
    setIsModalOpen(true);
  };

  const handleEditClick = ({
    id,
    title,
    description,
    priority,
    time,
    deadline,
  }) => {
    setEditTaskId(id);

    const cleanDeadline = deadline
      ? new Date(deadline).toLocaleDateString("en-CA", {
          timeZone: "Europe/Kyiv",
        })
      : "";

    setFormData({
      title: title || "",
      description: description || "",
      priority: priority || "MEDIUM",
      time: time || "",
      deadline: cleanDeadline,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTaskId) {
        const response = await axios.put(`/api/tasks/${editTaskId}`, formData);
        setItems(
          items.map((item) =>
            item.type === "task" && item.id === editTaskId
              ? { ...response.data, type: "task" }
              : item,
          ),
        );
      } else {
        const response = await axios.post("/api/tasks", formData);
        setItems([...items, { ...response.data, type: "task" }]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Помилка при збереженні таски:", error);
    }
  };

  return (
    <div className="taskspage">
      <header className="taskpage-header">
        <h1 className="taskspage-header main-header">Календар подій</h1>
        <button className="btn-create-task" onClick={handleCreateClick}>
          {" "}
          створити +
        </button>
      </header>
      <div className="taskspage-accordion">
        {weekDays.map((day, index) => {
          const dayItems = getItemsForDay(items, day.date);
          const isOpen = activeAccordionIndex === index;

          const dayItemsSort = [...dayItems].sort((a, b) => {
            const timeA =
              a.type === "event" ? formatIsoTime(a.startTime) : a.time;
            const timeB =
              b.type === "event" ? formatIsoTime(b.startTime) : b.time;
            if (!timeA) return 1;
            if (!timeB) return -1;

            return timeA.localeCompare(timeB);
          });

          return (
            <div
              key={index}
              className={`taskspage-accordion-section ${isOpen ? "open" : ""}`}
            >
              <div
                className="taskspage-accordion-header"
                onClick={() => setActiveAccordionIndex(isOpen ? null : index)}
              >
                <div className="day-info">
                  <span className="icon icon-calendar" />
                  <span className="day-name">{day.dayName},</span>
                  <span className="day-date">{day.dayString}</span>
                  <span className="icon icon-open-close" />
                </div>
                {/* <div className="day-badge">
                  {dayItems.length}{" "}
                  {dayItems.length === 1 ? "активність" : "активності"}
                </div> */}
              </div>

              {isOpen && (
                <div className="taskspage-accordion-content">
                  {dayItems.length === 0 ? (
                    <p className="empty-day">
                      На цей день завдань або подій немає
                    </p>
                  ) : (
                    <ul className="items-list">
                      {dayItemsSort.map(
                        ({
                          id,
                          type,
                          title,
                          time,
                          status,
                          description,
                          aiReason,
                          deadline,
                          startTime,
                          priority,
                        }) => {
                          let formattedTime = null;

                          if (type === "event" && startTime) {
                            formattedTime = formatIsoTime(startTime);
                          } else if (type === "task" && time) {
                            formattedTime = time;
                          }

                          const now = new Date();

                          const todayStr = now.toLocaleDateString("en-CA", {
                            timeZone: "Europe/Kyiv",
                          });

                          const currentTimeStr = now.toLocaleTimeString(
                            "uk-UA",
                            {
                              timeZone: "Europe/Kyiv",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          );

                          const taskDateStr = deadline
                            ? new Date(deadline).toLocaleDateString("en-CA", {
                                timeZone: "Europe/Kyiv",
                              })
                            : todayStr;

                          const isPastDay = taskDateStr < todayStr;

                          const isToday = taskDateStr === todayStr;
                          const isPastTime =
                            formattedTime && formattedTime < currentTimeStr;

                          const isExpired =
                            isPastDay || (isToday && isPastTime);

                          return (
                            <li
                              key={`${type}-${id}`}
                              className={classNames("tasks-list-item", type, {
                                expired: isExpired,
                              })}
                            >
                              <div className="task-card-wrapper">
                                <span className="task-card-time">
                                  {formattedTime}
                                </span>
                                <div className="task-card">
                                  {isExpired && (
                                    <div className="card-expired-overlay" />
                                  )}
                                  <div className="task-card-header">
                                    {priority && (
                                      <span
                                        id={priority.toLowerCase()}
                                        className="task-priority"
                                      >
                                        {priority}
                                      </span>
                                    )}
                                    <span className="task-card-title">
                                      {title}
                                    </span>

                                    {type === "task" && (
                                      <button
                                        className="btn btn-edit-task"
                                        onClick={() =>
                                          handleEditClick({
                                            id,
                                            title,
                                            description,
                                            priority,
                                            time,
                                            deadline,
                                          })
                                        }
                                      >
                                        <span className="icon icon-edit" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="task-card-header">
                                    {/* <span className="task-card-status">
                                    {status}
                                  </span> */}
                                  </div>
                                  <div className="task-card-details">
                                    {description && (
                                      <p className="task-card-desc">
                                        {description}
                                      </p>
                                    )}
                                    {aiReason && (
                                      <p className="task-card-desc ai-response">
                                        {aiReason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        },
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editTaskId}
      />
    </div>
  );
};

export default TasksPage;
