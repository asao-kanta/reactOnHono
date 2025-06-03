import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import TodoComponent from "./route/todo";

interface User {
	id: string;
	name: string;
	email: string;
}

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [authError, setAuthError] = useState<string | null>(null);

	// URLからauth_errorパラメータをチェック
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const errorParam = urlParams.get("auth_error");
		if (errorParam) {
			setAuthError("認証エラーが発生しました。再度お試しください。");
			// URLからエラーパラメータを削除
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, []);

	// 認証状態をチェック
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const response = await fetch('/prod/auth/me', {
				credentials: 'include',
			});

			if (response.ok) {
				const data = await response.json();
				setIsAuthenticated(data.authenticated);
				setUser(data.user);
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
		} catch (error) {
			console.error('認証状態確認エラー:', error);
			setIsAuthenticated(false);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await fetch('/prod/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});

			setIsAuthenticated(false);
			setUser(null);
			setAuthError(null);
		} catch (error) {
			console.error('ログアウトエラー:', error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
					<p className="mt-4 text-gray-600">読み込み中...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <LoginForm error={authError || undefined} />;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center">
							<h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-600">
								ようこそ、<span className="font-medium">{user?.name}</span>さん
							</span>
							<button
								onClick={handleLogout}
								className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ease-in-out"
							>
								ログアウト
							</button>
						</div>
					</div>
				</div>
			</header>
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<TodoComponent />
			</main>
		</div>
	);
}

export default App;
