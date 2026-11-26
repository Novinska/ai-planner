import { Router, Request, Response } from "express";
import { aiService } from "../services/aiService.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { prompt, categoryId } = req.body;
    const userId = (req as any).user?.id || 1;

    if (!prompt) {
      return res.status(400).json({ error: "Промпт не може бути порожнім" });
    }

    // інтелектуальне перепланування
    const existingTasks = await prisma.task.findMany({
      where: {
        userId,
        status: "TODO",
        deadline: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // від сьогодні
        },
      },
      select: {
        id: true,
        title: true,
        priority: true,
        aiReason: true,
        deadline: true,
        time: true,
        estimatedTime: true,
        description: true,
      },
    });

    const aiResponse = await aiService.analyzePrompt(prompt, existingTasks);

    let targetCategoryId = categoryId;
    if (!targetCategoryId) {
      const defaultCategory = await prisma.category.findFirst({
        where: { userId },
      });
      if (!defaultCategory) {
        const newCat = await prisma.category.create({
          data: { userId, categoryName: "ШІ Планування" },
        });
        targetCategoryId = newCat.id;
      } else {
        targetCategoryId = defaultCategory.id;
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdTasks = [];
      const updatedTasksLog = [];

      if (aiResponse.tasks && aiResponse.tasks.length > 0) {
        for (const t of aiResponse.tasks) {
          console.log("Ключі таски від ШІ:", Object.keys(t));
          console.log("Значення таски від ШІ:", JSON.stringify(t));

          const taskTime =
            t.time || (t as any).taskTime || (t as any).startTime || null;

          const taskPriority = t.priority || "MEDIUM";

          const createdTask = await tx.task.create({
            data: {
              userId,
              categoryId: targetCategoryId,
              title: t.title,
              description: t.description || "",
              aiReason: t.aiReason || null,
              priority: taskPriority,
              time: taskTime,
              estimatedTime: Number(t.estimatedTime) || 30,
              deadline: t.dueDate
                ? new Date(`${t.dueDate}T00:00:00.000Z`)
                : null,
              status: "TODO",
            },
          });

          await tx.aiLog.create({
            data: {
              taskId: createdTask.id,
              prompt,
              aiResponse: JSON.stringify(aiResponse),
            },
          });
          createdTasks.push(createdTask);
        }
      }

      if (aiResponse.tasksToUpdate && aiResponse.tasksToUpdate.length > 0) {
        for (const u of aiResponse.tasksToUpdate) {
          const taskToUpdate = await tx.task.findFirst({
            where: { id: Number(u.id), userId },
          });

          if (taskToUpdate) {
            let newDescription = taskToUpdate.description || "";
            const reasonLine = u.reason;

            if (u.reason) {
              if (!newDescription.includes(reasonLine)) {
                newDescription = newDescription
                  ? `${newDescription}\n${reasonLine}`
                  : reasonLine;
              }
            }

            const updated = await tx.task.update({
              where: { id: taskToUpdate.id },
              data: {
                deadline: u.newDueDate
                  ? new Date(`${u.newDueDate}T00:00:00.000Z`)
                  : taskToUpdate.deadline,
                time: u.newTime !== undefined ? u.newTime : taskToUpdate.time,
                priority: u.newPriority ? u.newPriority : taskToUpdate.priority,
                aiReason: u.reason || taskToUpdate.aiReason,
              },
            });
            updatedTasksLog.push(updated);
          }
        }
      }

      return { createdTasks, updatedTasksLog };
    });

    console.log(JSON.stringify(result.createdTasks, null, 2));

    return res.json({
      reply: aiResponse.reply,
      newTasks: result.createdTasks,
      updatedTasks: result.updatedTasksLog,
    });
  } catch (error) {
    console.error("Критична помилка в алгоритмі перепланування:", error);
    return res.status(500).json({
      error: "Внутрішня помилка сервера при переплануванні",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
