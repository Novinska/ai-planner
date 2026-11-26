import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import "./services/googleStrategy.js";
import authRoutes from "./routes/authRoutes.js";
import * as taskService from "./services/taskService.js";
import * as eventService from "./services/eventService.js";
import { syncEvents, syncTasks } from "./services/calendarService.js";
import aiRoutes from "./routes/aiRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app: Application = express();

const PORT = process.env.PORT || 5999;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",

    resave: false,

    saveUninitialized: true,

    cookie: {
      secure: false,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is alive");
});

app.use("/auth", authRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/sync-test", async (req: Request, res: Response) => {
  try {
    const eventsCount = await syncEvents(1);

    const tasksCount = await syncTasks(1);

    res.send(`Синхронізовано ${eventsCount} подій та ${tasksCount} завдань`);
  } catch (error) {
    console.error(error);

    res.status(500).send("Щось пішло не так");
  }
});

app.get("/api/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAllTasks();

    res.json(tasks);
  } catch (error) {
    console.error("Помилка при зверненні до БД:", error);

    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/tasks", async (req: Request, res: Response) => {
  try {
    const newTask = await taskService.createTask(req.body);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Creation error" });
  }
});

app.get("/api/events", async (req: Request, res: Response) => {
  try {
    const events = await eventService.getAllEvents(1);

    res.json(events);
  } catch (error) {
    console.error("Помилка при зверненні до БД:", error);

    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
