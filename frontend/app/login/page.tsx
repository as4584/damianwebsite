'use client';

/**
 * Login Page — Institutional Design
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
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top accent bar */}
      <div className="h-1 bg-accent-gold w-full" />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          {/* Brand */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-4">
              <h1 className="font-serif text-3xl tracking-tight text-primary-900">
                Innovation Development
              </h1>
            </Link>
            <p className="text-sm text-neutral-500 tracking-wide uppercase">
              Client Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm p-8 sm:p-10">
            <h2 className="font-serif text-2xl text-primary-900 mb-8">
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium tracking-wide uppercase text-neutral-500 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 focus:border-accent-gold transition-colors"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium tracking-wide uppercase text-neutral-500 mb-2"
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
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 focus:border-accent-gold transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-900 text-white py-3.5 px-6 rounded-sm hover:bg-primary-800 focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm tracking-wide uppercase"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm text-neutral-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="text-accent-gold hover:text-primary-900 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-sm p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700 mb-2">
                Development Mode — Demo Credentials
              </p>
              <p className="text-xs text-amber-600 font-mono">
                Email: test@innovation.com<br />
                Password: King1000$
              </p>
            </div>
          )}

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-neutral-400 hover:text-primary-900 transition-colors"
            >
              &larr; Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
