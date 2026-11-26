export const formatIsoTime = (isoString) => {
  if (!isoString) return null;
  return new Date(isoString).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Kyiv",
  });
};
