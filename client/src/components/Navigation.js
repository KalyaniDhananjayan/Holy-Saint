'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navigation() {
  const { user, loading } = useAuth();

  if (loading) return null;
    const logout = async () => {
        await fetch('https://holy-saint-backend.onrender.com/api/v1/auth/logout', {
            method: 'GET',
            credentials: 'include'
        });

        window.location.reload();
    };

  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

      {/* Brand */}
      <h1
        className="text-2xl tracking-widest text-zinc-200"
        style={{ fontFamily: 'Rasputin' }}
      >
        HOLY SAINT
      </h1>

      {/* Links */}
      <div className="flex items-center gap-6 text-sm">

        {!user && (
          <>
            <Link
              href="/login"
              className="text-zinc-300 hover:text-zinc-100 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-zinc-300 hover:text-zinc-100 transition"
            >
              Signup
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="text-zinc-400">
              {user.name}
            </span>

            <Link
              href="/me/orders"
              className="text-zinc-300 hover:text-zinc-100 transition"
            >
              Orders
            </Link>

            {user.role === 'admin' && (
              <Link
                href="/admin/orders"
                className="text-zinc-300 hover:text-zinc-100 transition"
              >
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-500 transition"
            >
              Logout
            </button>
          </>
        )}

        <Link
          href="/"
          className="text-zinc-300 hover:text-zinc-100 transition"
        >
          Products
        </Link>
      </div>

    </div>
  </nav>

  );
}
