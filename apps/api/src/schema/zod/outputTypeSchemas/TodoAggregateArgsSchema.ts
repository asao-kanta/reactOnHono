import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TodoOrderByWithRelationInputSchema } from "../inputTypeSchemas/TodoOrderByWithRelationInputSchema";
import { TodoWhereInputSchema } from "../inputTypeSchemas/TodoWhereInputSchema";
import { TodoWhereUniqueInputSchema } from "../inputTypeSchemas/TodoWhereUniqueInputSchema";

export const TodoAggregateArgsSchema: z.ZodType<Prisma.TodoAggregateArgs> = z
	.object({
		where: TodoWhereInputSchema.optional(),
		orderBy: z
			.union([
				TodoOrderByWithRelationInputSchema.array(),
				TodoOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: TodoWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export default TodoAggregateArgsSchema;
