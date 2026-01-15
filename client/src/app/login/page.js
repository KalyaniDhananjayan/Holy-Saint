'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only redirect if user is already logged in on page load
  useEffect(() => {
    if (loading) return;
    if (!user) return;

    // User is already logged in when landing on login page
    // Check if there's a flow mode - if yes, honor it
    const flowMode = localStorage.getItem('FLOW_MODE');
    
    if (flowMode === 'CHECKOUT' || flowMode === 'CHECKOUT_BUY_NOW') {
      console.log('👤 Already logged in, redirecting to checkout');
      router.replace('/checkout');
      return;
    }

    console.log('👤 Already logged in, redirecting to home');
    router.replace('/');
  }, [user, loading, router]);

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Invalid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        'https://holy-saint-backend.onrender.com/api/v1/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        }
      );

      if (!res.ok) {
        setError('Invalid email or password');
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      
      // Handle post-login redirect based on flow mode BEFORE setting user
      const flowMode = localStorage.getItem('FLOW_MODE');
      console.log('🔑 Login successful, flow mode:', flowMode);

      setUser(data.data.user);

      if (flowMode === 'CHECKOUT_BUY_NOW') {
        // Buy Now flow → go to checkout with checkoutData
        console.log('➡️ Redirecting to checkout (Buy Now)');
        router.replace('/checkout');
        return;
      }
      
      if (flowMode === 'CHECKOUT') {
        // Guest cart checkout flow → go to checkout with guest_cart
        console.log('➡️ Redirecting to checkout (Guest Cart)');
        router.replace('/checkout');
        return;
      }
      
      // Normal login (no flow mode) → go home, cart will auto-merge
      console.log('➡️ Redirecting to home (Normal login)');
      router.replace('/');
      
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-zinc-200 text-black font-semibold rounded-md hover:bg-zinc-300 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}