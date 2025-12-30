'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ Frontend validation
  const validate = () => {
    if (!form.name) {
      setError('Name is required');
      return false;
    }
    if (!form.email || !form.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!form.password || form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    const res = await fetch(
      'https://holy-saint-backend.onrender.com/api/v1/auth/signup',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      }
    );

    if (!res.ok) {
      setError('Signup failed');
      return;
    }

    const data = await res.json();

    // 🔥 update auth state immediately
    setUser(data.data.user);
  };

  // ✅ Redirect AFTER auth hydration
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

  // ✅ Loading UI (after hooks)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        Creating your account...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-zinc-100">
          Create Account
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100"
          />

          <input
            name="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100"
          />

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-zinc-200 text-zinc-900 font-semibold rounded-md hover:bg-zinc-300 transition"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
