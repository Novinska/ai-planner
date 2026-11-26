import { request } from "./apiServices";

export const taskService = {
  getAll: () => request("/tasks"),
  create: (data) =>
    request("/tasks", { method: "POST", body: JSON.stringify(data) }),
};

export const eventService = {
  getAll: () => request("/events"),
};

export const authService = {
  loginWithGoogle: () => {
    window.location.href = "http://localhost:5999/auth/google";
  },
};
