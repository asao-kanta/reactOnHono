import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { TodoStatusSchema } from "./TodoStatusSchema";

export const EnumTodoStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTodoStatusFieldUpdateOperationsInput> =
	z
		.object({
			set: z.lazy(() => TodoStatusSchema).optional(),
		})
		.strict();

export default EnumTodoStatusFieldUpdateOperationsInputSchema;
