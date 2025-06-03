import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handler = async (event: any) => {
	try {
		console.log("Starting database initialization...");

		// Prisma push (schema.prismaをデータベースに適用)
		await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS Todo (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        title VARCHAR(191) NOT NULL,
        description VARCHAR(191) NOT NULL,
        status ENUM('todo', 'in_progress', 'done') NOT NULL,
        importance DOUBLE NOT NULL DEFAULT 0.5,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `;

		console.log("Database initialization completed successfully");

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Database initialized successfully",
			}),
		};
	} catch (error) {
		console.error("Database initialization failed:", error);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Database initialization failed",
				error: error instanceof Error ? error.message : "Unknown error",
			}),
		};
	} finally {
		await prisma.$disconnect();
	}
};
