import { google } from "googleapis";
import { prisma } from "../lib/prisma.js";

export const syncEvents = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.accessToken) {
    throw new Error("Юзера не знайдено або немає токена");
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );

  auth.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = response.data.items || [];

  let syncedCount = 0;

  for (const googleEvent of events) {
    if (googleEvent.status === "cancelled") {
      continue;
    }

    if (googleEvent.htmlLink?.includes("tasks")) {
      console.log(`Відсіяли таску з календаря: ${googleEvent.summary}`);
      continue;
    }

    if (googleEvent.eventType && googleEvent.eventType !== "default") {
      if (googleEvent.eventType !== "outOfOffice") {
        continue;
      }
    }

    if (!googleEvent.start || !googleEvent.end) continue;

    await prisma.event.upsert({
      where: {
        externalId: googleEvent.id as string,
      },

      update: {
        title: googleEvent.summary || "Без назви",
        description: googleEvent.description || "",
        startTime: new Date(
          googleEvent.start.dateTime || googleEvent.start.date || "",
        ),
        endTime: new Date(
          googleEvent.end.dateTime || googleEvent.end.date || "",
        ),
      },

      create: {
        userId: user.id,
        externalId: googleEvent.id as string,
        title: googleEvent.summary || "Без назви",
        description: googleEvent.description || "",
        startTime: new Date(
          googleEvent.start.dateTime || googleEvent.start.date || "",
        ),
        endTime: new Date(
          googleEvent.end.dateTime || googleEvent.end.date || "",
        ),
      },
    });

    syncedCount++;
  }

  return syncedCount;
};

export const syncTasks = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.accessToken) throw new Error("No token");

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );
  auth.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const service = google.tasks({ version: "v1", auth });

  const taskLists = await service.tasklists.list();
  if (!taskLists.data.items) return 0;

  let totalSynced = 0;

  for (const list of taskLists.data.items) {
    const tasksData = await service.tasks.list({ tasklist: list.id });
    const tasks = tasksData.data.items || [];

    for (const googleTask of tasks) {
      if (!googleTask.title) continue;

      let category = await prisma.category.findFirst({ where: { userId } });
      if (!category) {
        category = await prisma.category.create({
          data: { categoryName: "Google Tasks", userId },
        });
      }

      await prisma.task.upsert({
        where: { externalId: googleTask.id as string },
        update: {
          title: googleTask.title,
          description: googleTask.notes || "",
          status: googleTask.status === "completed" ? "DONE" : "TODO",
          deadline: googleTask.due ? new Date(googleTask.due) : null,
        },
        create: {
          externalId: googleTask.id,
          userId: user.id,
          categoryId: category.id,
          title: googleTask.title,
          description: googleTask.notes || "",
          priority: "MEDIUM",
          estimatedTime: 30,
          status: googleTask.status === "completed" ? "DONE" : "TODO",
          deadline: googleTask.due ? new Date(googleTask.due) : null,
        },
      });
      totalSynced++;
    }
  }
  return totalSynced;
};
