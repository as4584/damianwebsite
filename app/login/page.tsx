'use client';

/**
 * Login Page
 * 
 * SECURITY:
 * - Password input has type="password" (masked)
 * - Form submits over HTTPS in production
 * - Credentials sent to /api/auth/signin (Auth.js endpoint)
 * - Session stored in HTTP-only secure cookie
 */

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call NextAuth signIn
      // SECURITY: This posts to /api/auth/signin with CSRF protection
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // We handle redirect manually for better UX
      });

      if (result?.error) {
        // Authentication failed
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
      router.refresh(); // Refresh to load authenticated state
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Innovation
          </h1>
          <p className="text-gray-600 font-medium">
            Business Development Solutions
          </p>
        </div>

        {/* Login Card - Glass morphism */}
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl shadow-blue-200/50 p-8 border border-white/20">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-5 py-3 backdrop-blur-xl bg-white/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg shadow-blue-100/50 transition-all duration-300 focus:shadow-xl focus:shadow-blue-200/50"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-5 py-3 backdrop-blur-xl bg-white/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg shadow-blue-100/50 transition-all duration-300 focus:shadow-xl focus:shadow-blue-200/50"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="backdrop-blur-xl bg-red-50/80 border border-red-200/50 text-red-700 px-5 py-4 rounded-xl font-medium shadow-lg shadow-red-100/50">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-xl shadow-blue-300/50 hover:shadow-2xl hover:shadow-blue-400/50 hover:scale-[1.02]"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Demo Credentials (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              Development Mode - Demo Credentials:
            </p>
            <p className="text-xs text-yellow-700 font-mono">
              Email: demo@innovationdevelopmentsolutions.com<br />
              Password: demo1234
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
