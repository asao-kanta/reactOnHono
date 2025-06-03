import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { DateTimeFilterSchema } from "./DateTimeFilterSchema";
import { EnumTodoStatusFilterSchema } from "./EnumTodoStatusFilterSchema";
import { FloatFilterSchema } from "./FloatFilterSchema";
import { StringFilterSchema } from "./StringFilterSchema";
import { TodoStatusSchema } from "./TodoStatusSchema";
import { TodoWhereInputSchema } from "./TodoWhereInputSchema";

export const TodoWhereUniqueInputSchema: z.ZodType<Prisma.TodoWhereUniqueInput> =
	z
		.object({
			id: z.string().uuid(),
		})
		.and(
			z
				.object({
					id: z.string().uuid().optional(),
					AND: z
						.union([
							z.lazy(() => TodoWhereInputSchema),
							z.lazy(() => TodoWhereInputSchema).array(),
						])
						.optional(),
					OR: z
						.lazy(() => TodoWhereInputSchema)
						.array()
						.optional(),
					NOT: z
						.union([
							z.lazy(() => TodoWhereInputSchema),
							z.lazy(() => TodoWhereInputSchema).array(),
						])
						.optional(),
					title: z
						.union([z.lazy(() => StringFilterSchema), z.string()])
						.optional(),
					status: z
						.union([
							z.lazy(() => EnumTodoStatusFilterSchema),
							z.lazy(() => TodoStatusSchema),
						])
						.optional(),
					description: z
						.union([z.lazy(() => StringFilterSchema), z.string()])
						.optional(),
					importance: z
						.union([z.lazy(() => FloatFilterSchema), z.number()])
						.optional(),
					createdAt: z
						.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
						.optional(),
					updatedAt: z
						.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
						.optional(),
				})
				.strict(),
		);

export default TodoWhereUniqueInputSchema;
