export const getNextSevenDays = (startDate = new Date()) => {
  const days = [];
  const baseDate = startDate ? new Date(startDate) : new Date();

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + i);

    const dayName = currentDate.toLocaleDateString("uk-UA", {
      weekday: "long",
    });
    const dayString = currentDate.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });

    days.push({
      date: currentDate,
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      dayString: dayString,
    });
  }
  return days;
};

export const getItemsForDay = (items, dayDate) => {
  if (!Array.isArray(items)) return [];

  return items.filter((item) => {
    const { deadline, startTime, createdAt } = item;

    const rawDate = deadline || startTime || createdAt;

    if (!rawDate) return false;

    const itemDate = new Date(rawDate);
    if (isNaN(itemDate.getTime())) return false;

    return (
      itemDate.getDate() === dayDate.getDate() &&
      itemDate.getMonth() === dayDate.getMonth() &&
      itemDate.getFullYear() === dayDate.getFullYear()
    );
  });
};
