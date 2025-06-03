import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TodoCreateManyInputSchema } from "../inputTypeSchemas/TodoCreateManyInputSchema";

export const TodoCreateManyArgsSchema: z.ZodType<Prisma.TodoCreateManyArgs> = z
	.object({
		data: z.union([
			TodoCreateManyInputSchema,
			TodoCreateManyInputSchema.array(),
		]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export default TodoCreateManyArgsSchema;
