'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navigation() {
  const { user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { clearCart } = useCart();
  
  const handleLogout = async () => {
    await logout();
  };

  if (loading) return null;
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
            onClick={handleLogout}
            className="text-zinc-300 hover:text-zinc-100 transition"
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
        <Link
          href="/cart"
          className="relative text-zinc-300 hover:text-zinc-100 transition"
        >
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-zinc-200 text-black text-xs rounded-full w-3 h-4 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </div>
  </nav>
  );
}
