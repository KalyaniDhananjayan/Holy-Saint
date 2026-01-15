'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, removeFromCart, totalAmount, loading } = useCart();

  const handleCheckout = () => {
    // If user is not logged in, set FLOW_MODE for guest cart checkout
    if (!user) {
      localStorage.setItem('FLOW_MODE', 'CHECKOUT');
    }
    // If user is logged in, don't set FLOW_MODE (normal user cart checkout)
    
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-2xl font-semibold">Your cart is empty.</p>
        <Link
          href="/"
          className="px-6 py-2 bg-zinc-200 text-black rounded-lg font-semibold hover:bg-zinc-300 transition"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4 mb-6">
        {cart.map(item => (
          <div key={item.productId} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-zinc-400 text-sm">Quantity: {item.quantity}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">₹{item.price * item.quantity}</span>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full px-8 py-3 bg-zinc-200 text-black rounded-lg font-semibold hover:bg-zinc-300 transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}