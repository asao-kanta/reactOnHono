import { z } from "zod";

export const TodoStatusSchema = z.enum(["todo", "in_progress", "done"]);

export type TodoStatusType = `${z.infer<typeof TodoStatusSchema>}`;

export default TodoStatusSchema;
