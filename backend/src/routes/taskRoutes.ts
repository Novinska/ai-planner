import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

const isAuthenticated = (req: any, res: Response, next: any) => {
  if (req.user) return next();
  return res.status(401).json({ message: "Неавторизований" });
};

router.get("/", isAuthenticated, async (req: any, res: Response) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;

    let whereCondition: any = { userId: userId };

    if (date) {
      whereCondition.deadline = {
        gte: new Date(`${date}T00:00:00.000Z`),
        lte: new Date(`${date}T23:59:59.999Z`),
      };
    }

    const tasks = await prisma.task.findMany({
      where: whereCondition,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Помилка при отриманні тасок:", error);
    return res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
});

router.post("/", isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    let {
      title,
      description,
      aiReason,
      priority,
      status,
      time,
      estimatedTime,
      deadline,
      categoryId,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Назва таски обов'язкова!" });
    }

    if (!categoryId) {
      let defaultCategory = await prisma.category.findFirst({
        where: { userId, categoryName: "Inbox" },
      });

      if (!defaultCategory) {
        defaultCategory = await prisma.category.create({
          data: { categoryName: "Inbox", userId },
        });
      }

      categoryId = defaultCategory.id;
    }

    const newTask = await prisma.task.create({
      data: {
        userId,
        title,
        time: time || null,
        description: description || "",
        aiReason: aiReason || null,
        priority: priority || "MEDIUM",
        estimatedTime: estimatedTime ? Number(estimatedTime) : 30,
        deadline: deadline ? new Date(deadline) : null,
        categoryId: Number(categoryId),
        status: status || "TODO",
      },
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Помилка при створенні таски:", error);
    return res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
});

router.put("/:id", isAuthenticated, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const {
      status,
      title,
      description,
      aiReason,
      priority,
      time,
      estimatedTime,
      deadline,
      categoryId,
    } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        status,
        title,
        time: time !== undefined ? time : undefined,
        description,
        aiReason: aiReason !== undefined ? aiReason : undefined,
        priority,
        estimatedTime: estimatedTime ? Number(estimatedTime) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Помилка при оновленні таски:", error);
    return res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
});

export default router;
