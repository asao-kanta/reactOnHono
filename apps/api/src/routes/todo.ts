import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import prismac from "../lib/db";
import {
	CallbackTodoSchema,
	CreateTodoSchema,
	UpdateTodoSchema,
} from "../schema/hono/schemas";

const todoRouter = new Hono();

// GET /todos
const getTodos = todoRouter.get("/", async (c) => {
	const todos = await prismac.todo.findMany();
	return c.json(todos);
});

// GET /todos/:id
const getTodo = todoRouter.get("/:id", async (c) => {
	const { id } = c.req.param();
	const todo = await prismac.todo.findUnique({ where: { id } });
	return todo ? c.json(todo) : c.notFound();
});

// POST /todos
const createTodo = todoRouter.post(
	"/",
	zValidator("json", CreateTodoSchema),
	async (c) => {
		const body = c.req.valid("json");
		const todo = await prismac.todo.create({ data: body });
		return c.json(todo);
	},
);

// PUT /todos/:id
const updateTodo = todoRouter.put(
	"/:id",
	zValidator("json", UpdateTodoSchema),
	async (c) => {
		const { id } = c.req.param();
		const body = c.req.valid("json");
		const todo = await prismac.todo.update({ where: { id }, data: body });
		return c.json(todo);
	},
);

// DELETE /todos/:id
const deleteTodo = todoRouter.delete("/:id", async (c) => {
	const { id } = c.req.param();
	await prismac.todo.delete({ where: { id } });
	return c.json({ message: "Todo deleted" });
});

todoRouter.post(
	"/callback",
	zValidator("json", CallbackTodoSchema),
	async (c) => {
		const body = await c.req.json();
		const todo = await prismac.todo.update({
			where: { id: body.id },
			data: { importance: body.importance },
		});
		return c.json(todo);
	},
);

const todoHandler = {
	getTodos,
	getTodo,
	createTodo,
	updateTodo,
	deleteTodo,
};

export type GetTodos = typeof getTodos;
export type GetTodo = typeof getTodo;
export type CreateTodo = typeof createTodo;
export type UpdateTodo = typeof updateTodo;
export type DeleteTodo = typeof deleteTodo;

export type TodoHandler = typeof todoHandler;

export default todoRouter;
