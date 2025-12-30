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

  // ✅ ALL HOOKS MUST RUN BEFORE ANY RETURN
  useEffect(() => {
    if (loading) return;

    if (user) {
      const action = JSON.parse(localStorage.getItem('postLoginAction'));

      if (action?.type === 'BUY') {
        localStorage.removeItem('postLoginAction');
        router.replace(`/product/${action.productId}?resume=true`);
      } else {
        router.replace('/');
      }
    }
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
    return;
  }

  const data = await res.json();

  setUser(data.data.user);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        Logging you in...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-zinc-100">
          Login
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400">
            {error}
          </p>
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
            className="w-full mt-4 py-2 bg-zinc-200 text-zinc-900 font-semibold rounded-md hover:bg-zinc-300 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
