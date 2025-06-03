import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { NestedEnumTodoStatusFilterSchema } from "./NestedEnumTodoStatusFilterSchema";
import { NestedIntFilterSchema } from "./NestedIntFilterSchema";
import { TodoStatusSchema } from "./TodoStatusSchema";

export const NestedEnumTodoStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTodoStatusWithAggregatesFilter> =
	z
		.object({
			equals: z.lazy(() => TodoStatusSchema).optional(),
			in: z
				.lazy(() => TodoStatusSchema)
				.array()
				.optional(),
			notIn: z
				.lazy(() => TodoStatusSchema)
				.array()
				.optional(),
			not: z
				.union([
					z.lazy(() => TodoStatusSchema),
					z.lazy(() => NestedEnumTodoStatusWithAggregatesFilterSchema),
				])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedEnumTodoStatusFilterSchema).optional(),
			_max: z.lazy(() => NestedEnumTodoStatusFilterSchema).optional(),
		})
		.strict();

export default NestedEnumTodoStatusWithAggregatesFilterSchema;
