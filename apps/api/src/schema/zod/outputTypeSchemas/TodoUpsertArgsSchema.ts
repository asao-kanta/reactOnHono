import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TodoCreateInputSchema } from "../inputTypeSchemas/TodoCreateInputSchema";
import { TodoUncheckedCreateInputSchema } from "../inputTypeSchemas/TodoUncheckedCreateInputSchema";
import { TodoUncheckedUpdateInputSchema } from "../inputTypeSchemas/TodoUncheckedUpdateInputSchema";
import { TodoUpdateInputSchema } from "../inputTypeSchemas/TodoUpdateInputSchema";
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

export const TodoUpsertArgsSchema: z.ZodType<Prisma.TodoUpsertArgs> = z
	.object({
		select: TodoSelectSchema.optional(),
		where: TodoWhereUniqueInputSchema,
		create: z.union([TodoCreateInputSchema, TodoUncheckedCreateInputSchema]),
		update: z.union([TodoUpdateInputSchema, TodoUncheckedUpdateInputSchema]),
	})
	.strict();

export default TodoUpsertArgsSchema;
