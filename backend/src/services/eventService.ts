import { prisma } from "../lib/prisma.js";

export const getAllEvents = async (userId: number) => {
  return await prisma.event.findMany({
    where: { userId },
    orderBy: { startTime: "asc" },
  });
};

export const createEvent = async (data: any) => {
  return await prisma.event.create({
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description || "",
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      externalId: data.externalId || null,
    },
  });
};
