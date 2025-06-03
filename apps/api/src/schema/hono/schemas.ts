import { z } from "@hono/zod-openapi";

export const TodoSchema = z
	.object({
		id: z.string().uuid().openapi({
			example: "123e4567-e89b-12d3-a456-426614174000",
		}),
		title: z.string().openapi({
			example: "Title",
		}),
		description: z.string().openapi({
			example: "Description",
		}),
		status: z.enum(["todo", "in_progress", "done"]).openapi({
			example: "todo",
		}),
		importance: z.number().openapi({
			example: 0.5,
		}),
		createdAt: z.coerce.date().openapi({
			example: new Date().toISOString(),
		}),
		updatedAt: z.coerce.date().openapi({
			example: new Date().toISOString(),
		}),
	})
	.openapi("TodoSchema");

export const CreateTodoSchema = z
	.object({
		title: z.string().openapi({
			example: "Title",
		}),
		description: z.string().openapi({
			example: "Description",
		}),
		status: z.enum(["todo", "in_progress", "done"]).openapi({
			example: "todo",
		}),
	})
	.openapi("CreateTodoSchema");

export const UpdateTodoSchema = z
	.object({
		title: z
			.string()
			.openapi({
				example: "Title",
			})
			.optional(),
		description: z
			.string()
			.openapi({
				example: "Description",
			})
			.optional(),
		status: z
			.enum(["todo", "in_progress", "done"])
			.openapi({
				example: "todo",
			})
			.optional(),
	})
	.openapi("UpdateTodoSchema");

export const CallbackTodoSchema = z
	.object({
		id: z.string().openapi({
			example: "123e4567-e89b-12d3-a456-426614174000",
		}),
		importance: z.number().openapi({
			example: 0.5,
		}),
	})
	.openapi("CallbackTodoSchema");
