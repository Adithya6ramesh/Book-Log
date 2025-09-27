import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card } from "@repo/ui/card";
import { useNavigate, Link } from "@tanstack/react-router";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Simple validation - just check if fields are filled
    if (username && password) {
      // Navigate to home page
      navigate({ to: "/" });
    } else {
      alert("Please fill in both username and password");
    }
  };



  return (
    <div className="min-h-screen bg-[#1a1a1c] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold mb-6"
            style={{
              background: 'linear-gradient(to right, #ec4899, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Book Logs
          </h1>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">Sign In</h2>
          <p className="text-gray-400">Welcome back</p>
        </div>
        <Card className="p-8 bg-[#1a1a1c] border border-[#2a2a2c] shadow-2xl">
        
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-[#1a1a1c] border-[#2a2a2c] text-gray-200 placeholder-gray-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#1a1a1c] border-[#2a2a2c] text-gray-200 placeholder-gray-500"
            />
          </div>
          
          <Button
            onClick={handleSignIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            Sign In
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};