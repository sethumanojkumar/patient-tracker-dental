import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: credentials.username,
        password: credentials.password,
      })

      if (result?.error) {
        toast.error('Invalid username or password!', {
          icon: '🔒',
        })
      } else {
        toast.success('Welcome back! 🎉', {
          icon: '✨',
        })
        router.push('/')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.', {
        icon: '⚠️',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🦷</div>
      <div className="absolute top-20 right-20 text-5xl opacity-20 animate-float-delayed">✨</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-float">💙</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float-delayed">😁</div>
      
      <div className="max-w-md w-full relative z-10 animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce">🦷✨</div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Patient Tracker
          </h1>
          <p className="text-gray-600 text-lg">Pediatric Dental Clinic</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-purple-100">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Please login to access patient records</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">👤</span> Username
              </label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 hover:border-purple-300 text-gray-900 font-medium"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">🔑</span> Password
              </label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 hover:border-pink-300 text-gray-900 font-medium"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>🔓</span>
                  <span>Login</span>
                  <span>✨</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Your data is secure and protected
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            For demo: Check your .env.local file for credentials
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-5deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
