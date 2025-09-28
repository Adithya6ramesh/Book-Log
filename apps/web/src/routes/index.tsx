import { createFileRoute } from "@tanstack/react-router";
import { BookList } from "../components/book-list";
import { LoginForm } from "../components/login-form";
import { useSession, authClient } from "../utils/auth-client";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: session, isInitialPending, isAuthenticated } = useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isInitialPending) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f11' }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <div className="dashboard-card mb-0 rounded-none border-b border-gray-600">
        <div className="flex justify-between items-center">
          <h1 
            className="text-2xl font-bold"
            style={{
              background: 'linear-gradient(to right, #ec4899, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Book Log
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, <span className="text-white font-semibold">{session?.user?.name || session?.user?.email}</span>!</span>
            <button 
              onClick={handleLogout}
              className="py-2 px-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <BookList />
    </div>
  );
}
