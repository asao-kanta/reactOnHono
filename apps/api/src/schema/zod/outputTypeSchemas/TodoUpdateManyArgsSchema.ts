import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TodoUncheckedUpdateManyInputSchema } from "../inputTypeSchemas/TodoUncheckedUpdateManyInputSchema";
import { TodoUpdateManyMutationInputSchema } from "../inputTypeSchemas/TodoUpdateManyMutationInputSchema";
import { TodoWhereInputSchema } from "../inputTypeSchemas/TodoWhereInputSchema";

export const TodoUpdateManyArgsSchema: z.ZodType<Prisma.TodoUpdateManyArgs> = z
	.object({
		data: z.union([
			TodoUpdateManyMutationInputSchema,
			TodoUncheckedUpdateManyInputSchema,
		]),
		where: TodoWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export default TodoUpdateManyArgsSchema;
