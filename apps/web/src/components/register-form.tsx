import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card } from "@repo/ui/card";
import { useNavigate, Link } from "@tanstack/react-router";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    // Navigate to home page after registration
    navigate({ to: "/" });
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Register</h1>
          <p className="text-gray-300">Join Book Log today</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <Button
            onClick={handleRegister}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
          >
            Register
          </Button>
          
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Already have an account?{" "}
              <Link 
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};