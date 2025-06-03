import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TodoOrderByWithRelationInputSchema } from "../inputTypeSchemas/TodoOrderByWithRelationInputSchema";
import { TodoScalarFieldEnumSchema } from "../inputTypeSchemas/TodoScalarFieldEnumSchema";
import { TodoWhereInputSchema } from "../inputTypeSchemas/TodoWhereInputSchema";
import { TodoWhereUniqueInputSchema } from "../inputTypeSchemas/TodoWhereUniqueInputSchema";
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TodoSelectSchema: z.ZodType<Prisma.TodoSelect> = z
	.object({
		id: z.boolean().optional(),
		title: z.boolean().optional(),
		status: z.boolean().optional(),
		description: z.boolean().optional(),
		importance: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
	})
	.strict();

export const TodoFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TodoFindFirstOrThrowArgs> =
	z
		.object({
			select: TodoSelectSchema.optional(),
			where: TodoWhereInputSchema.optional(),
			orderBy: z
				.union([
					TodoOrderByWithRelationInputSchema.array(),
					TodoOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: TodoWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([TodoScalarFieldEnumSchema, TodoScalarFieldEnumSchema.array()])
				.optional(),
		})
		.strict();

export default TodoFindFirstOrThrowArgsSchema;
