'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navigation() {
  const { user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { clearCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  
  const handleLogout = async () => {
    await logout();
  };

  if (loading) return null;
  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <h1
          className="text-xl sm:text-2xl tracking-widest text-zinc-200"
          style={{ fontFamily: 'Rasputin' }}
        >
          HOLY SAINT
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm">

          {!user && (
            <>
              <Link href="/login" className="text-zinc-300 hover:text-zinc-100">
                Login
              </Link>
              <Link href="/signup" className="text-zinc-300 hover:text-zinc-100">
                Signup
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="text-zinc-400">{user.name}</span>

              <Link href="/me/orders" className="text-zinc-300 hover:text-zinc-100">
                Orders
              </Link>

              {user.role === 'admin' && (
                <Link href="/admin/orders" className="text-zinc-300 hover:text-zinc-100">
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-zinc-300 hover:text-zinc-100"
              >
                Logout
              </button>
            </>
          )}

          <Link href="/" className="text-zinc-300 hover:text-zinc-100">
            Products
          </Link>

          <Link href="/cart" className="relative text-zinc-300 hover:text-zinc-100">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-zinc-200 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative text-zinc-300">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-zinc-200 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-zinc-300 text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
          <div className="flex flex-col px-6 py-4 space-y-4 text-sm">

            {!user && (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-zinc-300">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="text-zinc-300">
                  Signup
                </Link>
              </>
            )}

            {user && (
              <>
                <span className="text-zinc-400">{user.name}</span>

                <Link href="/me/orders" onClick={() => setMenuOpen(false)} className="text-zinc-300">
                  Orders
                </Link>

                {user.role === 'admin' && (
                  <Link href="/admin/orders" onClick={() => setMenuOpen(false)} className="text-zinc-300">
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-zinc-300"
                >
                  Logout
                </button>
              </>
            )}

            <Link href="/" onClick={() => setMenuOpen(false)} className="text-zinc-300">
              Products
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
