import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { SortOrderSchema } from "./SortOrderSchema";

export const TodoAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TodoAvgOrderByAggregateInput> =
	z
		.object({
			importance: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export default TodoAvgOrderByAggregateInputSchema;
