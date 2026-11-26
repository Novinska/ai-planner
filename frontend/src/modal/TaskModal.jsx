import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "../planner/calendar/styles/calendar.scss";
import "./style.scss";

const formatDateToUA = (dateString) => {
  if (!dateString) return "";

  if (dateString instanceof Date) {
    dateString = dateString.toLocaleDateString("en-CA", {
      timeZone: "Europe/Kyiv",
    });
  }

  if (typeof dateString !== "string") return "";

  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString; // якщо формат якийсь не такий

  const [year, month, day] = parts;
  return `${day}.${month}.${year}`;
};

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  if (!isOpen) return null;

  const handleDateSelect = (clickedDate) => {
    const formattedDate = clickedDate.toLocaleDateString("en-CA", {
      timeZone: "Europe/Kyiv",
    });

    setFormData({ ...formData, deadline: formattedDate });
    setShowCalendar(false);
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-content">
        {/* <h2>{isEditing ? "Редагувати завдання" : "Створити завдання"}</h2> */}
        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-group">
            <label className="modal-task-label">Назва</label>
            <input
              className="users-response"
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="modal-task-label">Опис</label>
            <textarea
              className="users-response"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="modal-task-label">Пріоритет</label>
            <div className="select-wrapper">
              <select
                className="priority-selector"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="modal-task-label">Час</label>
            <input
              className="users-response"
              type="text"
              placeholder="14:00"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
          </div>

          <div className="form-group calendar-dropdown-wrapper">
            <label className="modal-task-label">Дата дедлайну</label>
            {/* <input
              className="users-response"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            /> */}
            <div
              className="calendar-input-trigger users-response"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {formatDateToUA(formData.deadline)}

              <span className="icon icon-calendar" />
            </div>
            {showCalendar && (
              <div className="calendar-dropdown-content">
                <Calendar
                  onChange={handleDateSelect}
                  value={
                    formData.deadline ? new Date(formData.deadline) : new Date()
                  }
                  minDate={new Date()}
                  view="month"
                  prev2Label={null}
                  next2Label={null}
                  locale="uk-UA"
                  navigationLabel={({ date, locale }) => {
                    const month = date.toLocaleDateString(locale, {
                      month: "long",
                    });
                    const year = date.getFullYear();
                    return `${month} ${year}`;
                  }}
                  tileClassName={({ date, view }) => {
                    if (view === "month") {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) return "past-day";
                    }
                    return null;
                  }}
                />
              </div>
            )}
          </div>

          {/* {isEditing && (
            <div className="form-group">
              <label>Причина від ШІ / Коментар</label>
              <input 
                type="text" 
                value={formData.aiReason || ""} 
                onChange={(e) => setFormData({ ...formData, aiReason: e.target.value })} 
              />
            </div>
          )} */}

          <div className="modal-actions btn-group">
            <button
              type="button"
              className="modal-actions-btn btn-cancel"
              onClick={onClose}
            >
              Скасувати
            </button>
            <button type="submit" className="modal-actions-btn btn-save">
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
