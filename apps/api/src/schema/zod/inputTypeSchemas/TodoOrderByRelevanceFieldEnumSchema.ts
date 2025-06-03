import { z } from "zod";

export const TodoOrderByRelevanceFieldEnumSchema = z.enum([
	"id",
	"title",
	"description",
]);

export default TodoOrderByRelevanceFieldEnumSchema;
