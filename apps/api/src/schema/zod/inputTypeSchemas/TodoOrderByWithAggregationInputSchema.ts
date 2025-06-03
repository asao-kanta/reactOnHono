import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { SortOrderSchema } from "./SortOrderSchema";
import { TodoAvgOrderByAggregateInputSchema } from "./TodoAvgOrderByAggregateInputSchema";
import { TodoCountOrderByAggregateInputSchema } from "./TodoCountOrderByAggregateInputSchema";
import { TodoMaxOrderByAggregateInputSchema } from "./TodoMaxOrderByAggregateInputSchema";
import { TodoMinOrderByAggregateInputSchema } from "./TodoMinOrderByAggregateInputSchema";
import { TodoSumOrderByAggregateInputSchema } from "./TodoSumOrderByAggregateInputSchema";

export const TodoOrderByWithAggregationInputSchema: z.ZodType<Prisma.TodoOrderByWithAggregationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			title: z.lazy(() => SortOrderSchema).optional(),
			status: z.lazy(() => SortOrderSchema).optional(),
			description: z.lazy(() => SortOrderSchema).optional(),
			importance: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			_count: z.lazy(() => TodoCountOrderByAggregateInputSchema).optional(),
			_avg: z.lazy(() => TodoAvgOrderByAggregateInputSchema).optional(),
			_max: z.lazy(() => TodoMaxOrderByAggregateInputSchema).optional(),
			_min: z.lazy(() => TodoMinOrderByAggregateInputSchema).optional(),
			_sum: z.lazy(() => TodoSumOrderByAggregateInputSchema).optional(),
		})
		.strict();

export default TodoOrderByWithAggregationInputSchema;
