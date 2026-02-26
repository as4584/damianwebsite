'use client';

/**
 * Signup Page — Institutional Design
 * 
 * SECURITY:
 * - Password input has type="password" (masked)
 * - Form validates on client and server
 * - Password is sent over HTTPS in production
 * - Server hashes password before storage
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push('/login?signup=success');
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 focus:border-accent-gold transition-colors';

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
              Create Your Account
            </p>
          </div>

          {/* Signup Card */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm p-8 sm:p-10">
            <h2 className="font-serif text-2xl text-primary-900 mb-8">
              Sign Up
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium tracking-wide uppercase text-neutral-500 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className={inputClasses}
                  placeholder="John Smith"
                  disabled={isLoading}
                />
              </div>

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
                  className={inputClasses}
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
                  autoComplete="new-password"
                  className={inputClasses}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <p className="text-xs text-neutral-400 mt-1.5">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium tracking-wide uppercase text-neutral-500 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputClasses}
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
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm text-neutral-500">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-accent-gold hover:text-primary-900 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

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
