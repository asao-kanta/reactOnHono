import { z } from "zod";
import { TodoStatusSchema } from "../inputTypeSchemas/TodoStatusSchema";

/////////////////////////////////////////
// TODO SCHEMA
/////////////////////////////////////////

export const TodoSchema = z.object({
	status: TodoStatusSchema,
	id: z.string().uuid(),
	title: z.string(),
	description: z.string(),
	importance: z.number(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Todo = z.infer<typeof TodoSchema>;

export default TodoSchema;
