import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { DateTimeWithAggregatesFilterSchema } from "./DateTimeWithAggregatesFilterSchema";
import { EnumTodoStatusWithAggregatesFilterSchema } from "./EnumTodoStatusWithAggregatesFilterSchema";
import { FloatWithAggregatesFilterSchema } from "./FloatWithAggregatesFilterSchema";
import { StringWithAggregatesFilterSchema } from "./StringWithAggregatesFilterSchema";
import { TodoStatusSchema } from "./TodoStatusSchema";

export const TodoScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TodoScalarWhereWithAggregatesInput> =
	z
		.object({
			AND: z
				.union([
					z.lazy(() => TodoScalarWhereWithAggregatesInputSchema),
					z.lazy(() => TodoScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => TodoScalarWhereWithAggregatesInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => TodoScalarWhereWithAggregatesInputSchema),
					z.lazy(() => TodoScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			id: z
				.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
				.optional(),
			title: z
				.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
				.optional(),
			status: z
				.union([
					z.lazy(() => EnumTodoStatusWithAggregatesFilterSchema),
					z.lazy(() => TodoStatusSchema),
				])
				.optional(),
			description: z
				.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
				.optional(),
			importance: z
				.union([z.lazy(() => FloatWithAggregatesFilterSchema), z.number()])
				.optional(),
			createdAt: z
				.union([
					z.lazy(() => DateTimeWithAggregatesFilterSchema),
					z.coerce.date(),
				])
				.optional(),
			updatedAt: z
				.union([
					z.lazy(() => DateTimeWithAggregatesFilterSchema),
					z.coerce.date(),
				])
				.optional(),
		})
		.strict();

export default TodoScalarWhereWithAggregatesInputSchema;
