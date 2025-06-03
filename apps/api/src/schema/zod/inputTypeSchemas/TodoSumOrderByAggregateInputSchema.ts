import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { SortOrderSchema } from "./SortOrderSchema";

export const TodoSumOrderByAggregateInputSchema: z.ZodType<Prisma.TodoSumOrderByAggregateInput> =
	z
		.object({
			importance: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export default TodoSumOrderByAggregateInputSchema;
