import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookList } from "../components/book-list";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<"welcome" | "login" | "register">("welcome");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      setIsLoggedIn(true);
      setCurrentView("welcome");
    } else {
      alert("Please fill in both username and password");
    }
  };

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setIsLoggedIn(true);
    setCurrentView("welcome");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("welcome");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  if (!isLoggedIn && currentView === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f11' }}>
        <div className="dashboard-card max-w-md w-full mx-4">
          <div className="text-center">
            <h1 
              className="text-5xl font-bold mb-8"
              style={{
                background: 'linear-gradient(to right, #ec4899, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Book Log
            </h1>
            <p className="text-gray-400 mb-8">Welcome to your personal book collection</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setCurrentView("login")}
                className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </button>
              
              <button 
                onClick={() => setCurrentView("register")}
                className="w-full py-3 px-6 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-200"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && currentView === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f11' }}>
        <div className="dashboard-card max-w-md w-full mx-4">
          <h1 
            className="text-3xl font-bold mb-6 text-center"
            style={{
              background: 'linear-gradient(to right, #ec4899, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Sign In
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="metric-label block mb-2">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="metric-label block mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            <button 
              onClick={handleLogin}
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Sign In
            </button>
            
            <div className="text-center space-y-2">
              <button 
                onClick={() => setCurrentView("register")}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Don't have an account? Register here
              </button>
              
              <br />
              
              <button 
                onClick={() => setCurrentView("welcome")}
                className="text-gray-400 hover:text-gray-300 text-sm"
              >
                ← Back to welcome
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && currentView === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f11' }}>
        <div className="dashboard-card max-w-md w-full mx-4">
          <h1 
            className="text-3xl font-bold mb-6 text-center"
            style={{
              background: 'linear-gradient(to right, #ec4899, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Create Account
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="metric-label block mb-2">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username"
              />
            </div>
            
            <div>
              <label className="metric-label block mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <label className="metric-label block mb-2">Confirm Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
            </div>
            
            <button 
              onClick={handleRegister}
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Create Account
            </button>
            
            <div className="text-center space-y-2">
              <button 
                onClick={() => setCurrentView("login")}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Already have an account? Sign in here
              </button>
              
              <br />
              
              <button 
                onClick={() => setCurrentView("welcome")}
                className="text-gray-400 hover:text-gray-300 text-sm"
              >
                ← Back to welcome
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
            <span className="text-gray-300">Welcome, <span className="text-white font-semibold">{username}</span>!</span>
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
