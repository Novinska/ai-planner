import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      username: "Anastasia",
      googleId: "test-google-id-123",
    },
  });

  const category = await prisma.category.create({
    data: {
      categoryName: "Category1",
      userId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Налаштування бази",
      description: "Перевірка посіву даних з Enum",
      status: "IN_PROGRESS",
      priority: "High",
      userId: user.id,
      categoryId: category.id,
      estimatedTime: 60,
      deadline: new Date(2026, 5, 1),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
