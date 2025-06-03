import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TodoWhereUniqueInputSchema } from "../inputTypeSchemas/TodoWhereUniqueInputSchema";
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TodoSelectSchema: z.ZodType<Prisma.TodoSelect> = z
	.object({
		id: z.boolean().optional(),
		title: z.boolean().optional(),
		status: z.boolean().optional(),
		description: z.boolean().optional(),
		importance: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
	})
	.strict();

export const TodoFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TodoFindUniqueOrThrowArgs> =
	z
		.object({
			select: TodoSelectSchema.optional(),
			where: TodoWhereUniqueInputSchema,
		})
		.strict();

export default TodoFindUniqueOrThrowArgsSchema;
