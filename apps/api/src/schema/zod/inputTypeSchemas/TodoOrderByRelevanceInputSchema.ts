import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { SortOrderSchema } from "./SortOrderSchema";
import { TodoOrderByRelevanceFieldEnumSchema } from "./TodoOrderByRelevanceFieldEnumSchema";

export const TodoOrderByRelevanceInputSchema: z.ZodType<Prisma.TodoOrderByRelevanceInput> =
	z
		.object({
			fields: z.union([
				z.lazy(() => TodoOrderByRelevanceFieldEnumSchema),
				z.lazy(() => TodoOrderByRelevanceFieldEnumSchema).array(),
			]),
			sort: z.lazy(() => SortOrderSchema),
			search: z.string(),
		})
		.strict();

export default TodoOrderByRelevanceInputSchema;
