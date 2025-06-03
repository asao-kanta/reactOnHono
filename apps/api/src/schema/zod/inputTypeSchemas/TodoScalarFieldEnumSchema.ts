import { z } from "zod";

export const TodoScalarFieldEnumSchema = z.enum([
	"id",
	"title",
	"status",
	"description",
	"importance",
	"createdAt",
	"updatedAt",
]);

export default TodoScalarFieldEnumSchema;
