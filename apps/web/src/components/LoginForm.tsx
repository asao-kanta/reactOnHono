import type React from "react";

interface LoginFormProps {
	error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ error }) => {
	const handleLogin = () => {
		// バックエンドの認証エンドポイントにリダイレクト
		window.location.href = '/prod/auth/login';
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
			<div className="max-w-lg w-full space-y-8">
				<div className="text-center">
					<div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
						<svg
							className="h-8 w-8 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
						Todo App にログイン
					</h2>
					<p className="mt-3 text-center text-lg text-gray-600">
						Microsoft Entra ID でログインしてください
					</p>
				</div>
				<div className="bg-white py-10 px-8 shadow-xl rounded-xl">
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
							<div className="flex">
								<svg
									className="h-5 w-5 text-red-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
								<div className="ml-3">
									<p className="text-base text-red-700">{error}</p>
								</div>
							</div>
						</div>
					)}

					<div className="space-y-6">
						<button
							onClick={handleLogin}
							className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
						>
							<svg
								className="mr-3 h-5 w-5"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M23.32 10.95c0-.93-.08-1.83-.23-2.69H12v5.08h6.35c-.27 1.45-1.1 2.68-2.35 3.51v2.91h3.81c2.22-2.04 3.51-5.05 3.51-8.81z" />
								<path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.81-2.91c-1.08.73-2.46 1.16-4.12 1.16-3.17 0-5.85-2.14-6.81-5.02H1.34v3.01C3.32 21.13 7.36 24 12 24z" />
								<path d="M5.19 14.32c-.25-.73-.39-1.51-.39-2.32s.14-1.59.39-2.32V6.67H1.34C.49 8.37 0 10.13 0 12s.49 3.63 1.34 5.33l3.85-3.01z" />
								<path d="M12 4.75c1.78 0 3.38.61 4.64 1.8l3.42-3.42C18.95 1.19 15.74 0 12 0 7.36 0 3.32 2.87 1.34 6.67l3.85 3.01c.96-2.88 3.64-5.02 6.81-5.02z" />
							</svg>
							Microsoft でログイン
						</button>

						<div className="text-center">
							<p className="text-sm text-gray-500">
								組織のMicrosoft アカウントでログインしてください
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
