'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    const res = await fetch('https://holy-saint-backend.onrender.com/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      setError('Signup failed');
      return;
    }

    window.location.href = '/';

  };

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
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
          />

          <input
            name="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
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
