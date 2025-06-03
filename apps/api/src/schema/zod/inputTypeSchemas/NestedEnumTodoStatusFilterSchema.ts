import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { TodoStatusSchema } from "./TodoStatusSchema";

export const NestedEnumTodoStatusFilterSchema: z.ZodType<Prisma.NestedEnumTodoStatusFilter> =
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
					z.lazy(() => NestedEnumTodoStatusFilterSchema),
				])
				.optional(),
		})
		.strict();

export default NestedEnumTodoStatusFilterSchema;
