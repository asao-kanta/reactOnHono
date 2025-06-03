import {
	CreateTodoSchema,
	type TodoSchema,
	type UpdateTodoSchema,
} from "@api/schema/hono/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { z } from "zod";

// Zodスキーマから型を推論
type CreateTodoType = z.infer<typeof CreateTodoSchema>;
type UpdateTodoType = z.infer<typeof UpdateTodoSchema>;
type TodoType = z.infer<typeof TodoSchema>;

const TodoComponent = () => {
	const [newTodo, setNewTodo] = useState<CreateTodoType>({
		title: "",
		description: "",
		status: "todo",
	});
	const [editTodo, setEditTodo] = useState<TodoType | null>(null);
	const queryClient = useQueryClient();

	// 認証エラーハンドリング（ログアウト）
	const handleAuthError = () => {
		// セッション認証なので、ページをリロードして認証状態をリセット
		window.location.reload();
	};

	const {
		data: todos,
		isLoading,
		error,
	} = useQuery<TodoType[]>({
		queryKey: ["todos"],
		queryFn: async () => {
			const res = await fetch("/prod/api/todos", {
				credentials: "include", // セッションクッキーを含める
			});

			// 認証エラーの場合はページリロード
			if (res.status === 401) {
				handleAuthError();
				throw new Error("認証エラーが発生しました。再ログインしてください。");
			}

			const data = (await res.json()) as {
				title: string;
				description: string;
				status: string;
				id: string;
				createdAt: string;
				updatedAt: string;
				importance?: number;
			}[];
			return data.map((todo) => ({
				...todo,
				status: todo.status as "todo" | "in_progress" | "done",
				createdAt: new Date(todo.createdAt),
				updatedAt: new Date(todo.updatedAt),
			})) as TodoType[];
		},
	});

	const { mutate: createTodo } = useMutation({
		mutationFn: async (todo: CreateTodoType) => {
			const result = CreateTodoSchema.safeParse(todo);
			if (!result.success) {
				console.error("Validation failed:", result.error.format());
				throw new Error("Validation error. Please check the input.");
			}

			const res = await fetch("/prod/api/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // セッションクッキーを含める
				body: JSON.stringify(result.data),
			});
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] }); // 🔄 再取得
		},
	});

	const { mutate: updateTodo } = useMutation({
		mutationFn: async (todo: UpdateTodoType & { id: string }) => {
			const res = await fetch(`/prod/api/todos/${todo.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // セッションクッキーを含める
				body: JSON.stringify(todo),
			});
			return res.json();
		},
		onSuccess: () => {
			setEditTodo(null);
			queryClient.invalidateQueries({ queryKey: ["todos"] }); // 🔄 再取得
		},
	});

	const { mutate: deleteTodo } = useMutation({
		mutationFn: async (id: string | undefined) => {
			if (!id) return;
			const res = await fetch(`/prod/api/todos/${id}`, {
				method: "DELETE",
				credentials: "include", // セッションクッキーを含める
			});
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] }); // 🔄 再取得
		},
	});

	const [validationError, setValidationError] = useState("");

	const handleCreate = () => {
		if (!newTodo.title.trim() || !newTodo.description.trim()) {
			setValidationError("Title と Description は必須です。");
			return;
		}

		setValidationError(""); // エラー解除
		createTodo(newTodo); // 本来の送信
		// フォームをリセット
		setNewTodo({ title: "", description: "", status: "todo" });
	};
	console.log(validationError);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						📋 Todo List
					</h1>
					<p className="text-lg text-gray-600">
						タスクを管理して効率的に作業を進めましょう
					</p>
				</div>

				{/* Create */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-6">
						新しいタスクを追加
					</h2>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								タイトル
							</label>
							<input
								className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
								placeholder="タスクのタイトルを入力"
								value={newTodo.title}
								onChange={(e) =>
									setNewTodo({ ...newTodo, title: e.target.value })
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								ステータス
							</label>
							<select
								className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
								value={newTodo.status}
								onChange={(e) =>
									setNewTodo({
										...newTodo,
										status: e.target.value as "todo" | "in_progress" | "done",
									})
								}
							>
								<option value="todo">Todo</option>
								<option value="in_progress">進行中</option>
								<option value="done">完了</option>
							</select>
						</div>
						<div className="lg:col-span-1">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								アクション
							</label>
							<button
								className="w-full h-[56px] bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 text-base"
								onClick={handleCreate}
							>
								タスクを追加
							</button>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							説明
						</label>
						<textarea
							className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
							placeholder="タスクの詳細な説明を入力"
							rows={4}
							value={newTodo.description}
							onChange={(e) =>
								setNewTodo({ ...newTodo, description: e.target.value })
							}
						/>
					</div>

					{/* エラー表示 */}
					{validationError && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
							<p className="text-red-700">{validationError}</p>
						</div>
					)}
				</div>

				{/* List */}
				<div className="space-y-6">
					{isLoading && (
						<div className="text-center py-12">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
							<p className="mt-4 text-lg text-gray-600">読み込み中...</p>
						</div>
					)}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-6">
							<p className="text-red-700 text-lg">{error.message}</p>
						</div>
					)}

					{/* Grid Layout for Tasks */}
					<div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
						{todos?.map((todo: TodoType) => (
							<div
								key={todo.id}
								className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 h-fit"
							>
								<div className="flex flex-col h-full">
									<div className="flex-1 mb-4">
										<h3 className="text-xl font-semibold text-gray-900 mb-3">
											{todo.title}
										</h3>
										<p className="text-gray-600 mb-4 leading-relaxed">
											{todo.description}
										</p>
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
											<span
												className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
													todo.status === "done"
														? "bg-green-100 text-green-800"
														: todo.status === "in_progress"
															? "bg-yellow-100 text-yellow-800"
															: "bg-gray-100 text-gray-800"
												}`}
											>
												{todo.status === "done"
													? "✅ 完了"
													: todo.status === "in_progress"
														? "🔄 進行中"
														: "📝 Todo"}
											</span>
											<span className="text-sm text-gray-500">
												作成日: {todo.createdAt.toLocaleDateString()}
											</span>
										</div>
									</div>
									<div className="flex space-x-3 pt-4 border-t border-gray-100">
										<button
											className="flex-1 px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-150"
											onClick={() => setEditTodo(todo as TodoType)}
										>
											編集
										</button>
										<button
											className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
											onClick={() => deleteTodo(todo.id)}
										>
											削除
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{todos?.length === 0 && !isLoading && (
						<div className="text-center py-16">
							<svg
								className="mx-auto h-16 w-16 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							<p className="mt-4 text-xl text-gray-500">
								まだタスクがありません
							</p>
							<p className="text-lg text-gray-400">
								上のフォームから新しいタスクを追加してみましょう
							</p>
						</div>
					)}
				</div>

				{/* Edit Modal */}
				{editTodo && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
						<div className="relative top-20 mx-auto p-6 border w-11/12 max-w-2xl shadow-lg rounded-xl bg-white">
							<h3 className="text-2xl font-semibold text-gray-900 mb-6">
								タスクを編集
							</h3>
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										タイトル
									</label>
									<input
										className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
										value={editTodo.title}
										onChange={(e) =>
											setEditTodo({ ...editTodo, title: e.target.value })
										}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										説明
									</label>
									<textarea
										className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
										rows={4}
										value={editTodo.description}
										onChange={(e) =>
											setEditTodo({ ...editTodo, description: e.target.value })
										}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										ステータス
									</label>
									<select
										className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
										value={editTodo.status}
										onChange={(e) =>
											setEditTodo({
												...editTodo,
												status: e.target.value as
													| "todo"
													| "in_progress"
													| "done",
											})
										}
									>
										<option value="todo">Todo</option>
										<option value="in_progress">進行中</option>
										<option value="done">完了</option>
									</select>
								</div>
								<div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
									<button
										className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150"
										onClick={() => setEditTodo(null)}
									>
										キャンセル
									</button>
									<button
										className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
										onClick={() =>
											updateTodo({
												...editTodo,
												status: editTodo.status as
													| "todo"
													| "in_progress"
													| "done",
											} as UpdateTodoType & { id: string })
										}
									>
										更新
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TodoComponent;
