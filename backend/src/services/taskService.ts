import { prisma } from "../lib/prisma.js";

export const getAllTasks = async () => {
  return await prisma.task.findMany({
    include: { category: true },
  });
};

export const createTask = async (data: any) => {
  const {
    title,
    description,
    priority,
    deadline,
    estimatedTime,
    userId,
    categoryId,
  } = data;

  return await prisma.task.create({
    data: {
      title,
      description,
      priority: priority || "LOW",
      status: "TODO",
      estimatedTime: Number(estimatedTime) || 0,
      deadline: new Date(),

      user: {
        connect: { id: Number(userId) },
      },
      category: {
        connect: { id: Number(categoryId) },
      },
    },
  });
};
