import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TodoCreateInputSchema } from "../inputTypeSchemas/TodoCreateInputSchema";
import { TodoUncheckedCreateInputSchema } from "../inputTypeSchemas/TodoUncheckedCreateInputSchema";
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

export const TodoCreateArgsSchema: z.ZodType<Prisma.TodoCreateArgs> = z
	.object({
		select: TodoSelectSchema.optional(),
		data: z.union([TodoCreateInputSchema, TodoUncheckedCreateInputSchema]),
	})
	.strict();

export default TodoCreateArgsSchema;
