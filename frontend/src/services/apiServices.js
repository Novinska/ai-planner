const BASE_URL = "http://localhost:5999/api";

export const request = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error("Помилка запиту");
  return response.json();
};
