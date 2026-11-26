import { useState } from "react";
import Calendar from "react-calendar";
import "../styles/calendar.scss";

const CalendarPage = ({ setActivePage, setSelectedDate }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (clickedDate) => {
    setDate(clickedDate);

    const today = new Date();

    const isToday =
      clickedDate.getDate() === today.getDate() &&
      clickedDate.getMonth() === today.getMonth() &&
      clickedDate.getFullYear() === today.getFullYear();

    if (isToday) {
      setSelectedDate(clickedDate);
      setActivePage("dayplan");
    } else {
      setSelectedDate(clickedDate);
      setActivePage("tasks");
    }
  };

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        {/* <h1 className="main-header">Календар подій</h1> */}
        <p className="desc">
          Обери день, щоб спланувати завдання або переглянути розклад
        </p>
      </header>
      <div className="calendar-wrapper">
        <Calendar
          onChange={handleDateChange}
          // onViewChange={() => {}}
          value={date}
          minDate={new Date()}
          view="month"
          prev2Label={null}
          next2Label={null}
          locale="uk-UA"
          navigationLabel={({ date, locale }) => {
            const month = date.toLocaleDateString(locale, { month: "long" });
            const year = date.getFullYear();

            return `${month} ${year}`;
          }}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              const today = new Date();

              today.setHours(0, 0, 0, 0);
              if (date < today) {
                return "past-day";
              }
            }
            return null;
          }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
