import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Register</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              type="text"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400"
              placeholder="Choose a username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400"
              placeholder="Create a password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input 
              type="password"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400"
              placeholder="Confirm your password"
            />
          </div>
          
          <button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition-colors"
            onClick={() => window.location.href = '/'}
          >
            Register
          </button>
          
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-purple-400 hover:text-purple-300 underline">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}