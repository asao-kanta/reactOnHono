import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { TodoStatusSchema } from "./TodoStatusSchema";

export const TodoUncheckedCreateInputSchema: z.ZodType<Prisma.TodoUncheckedCreateInput> =
	z
		.object({
			id: z.string().uuid().optional(),
			title: z.string(),
			status: z.lazy(() => TodoStatusSchema),
			description: z.string(),
			importance: z.number().optional(),
			createdAt: z.coerce.date().optional(),
			updatedAt: z.coerce.date().optional(),
		})
		.strict();

export default TodoUncheckedCreateInputSchema;
