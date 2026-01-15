'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const [items, setItems] = useState(null);
  const [paying, setPaying] = useState(false);
  const [itemsLocked, setItemsLocked] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;

    // Redirect to login if not authenticated
    if (!user) {
      localStorage.setItem('FLOW_MODE', 'CHECKOUT');
      router.push('/login');
      return;
    }

    // If items are already locked (set once), don't recalculate
    if (itemsLocked) return;

    // User is authenticated - determine which items to checkout (ONCE)
    const flowMode = localStorage.getItem('FLOW_MODE');
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
    const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];

    console.log('🔍 Checkout Debug:', {
      flowMode,
      hasCheckoutData: !!checkoutData,
      checkoutDataItems: checkoutData?.items?.length,
      guestCartLength: guestCart.length,
      userCartLength: cart.length
    });

    if (flowMode === 'CHECKOUT_BUY_NOW') {
      if (checkoutData?.items) {
        // Buy Now flow → use items from checkoutData
        console.log('📦 Checkout: Buy Now flow', checkoutData.items);
        setItems(checkoutData.items);
        setItemsLocked(true);
        return;
      } else {
        console.error('⚠️ Buy Now flow but no checkoutData found!');
      }
    }
    
    if (flowMode === 'CHECKOUT' && guestCart.length > 0) {
      // Guest cart checkout flow → use guest_cart from localStorage
      console.log('🛒 Checkout: Guest cart flow', guestCart);
      setItems(guestCart);
      setItemsLocked(true);
      return;
    }

    // Normal logged-in cart checkout OR guest cart is empty
    console.log('👤 Checkout: User cart flow', cart);
    setItems(cart);
    setItemsLocked(true);
    
  }, [user, authLoading, router, itemsLocked]);

  if (authLoading || !items) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl">Your checkout is empty</p>
        <button
          onClick={() => {
            localStorage.removeItem('FLOW_MODE');
            localStorage.removeItem('checkoutData');
            router.push('/');
          }}
          className="px-6 py-2 bg-zinc-200 text-black rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handlePay = async () => {
    setPaying(true);

    try {
      const res = await fetch('https://holy-saint-backend.onrender.com/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: items.map(i => ({ tshirt: i.productId, quantity: i.quantity })),
          paymentMethod: 'dummy'
        })
      });

      if (!res.ok) throw new Error('Payment failed');

      const flowMode = localStorage.getItem('FLOW_MODE');

      // Clear based on what was checked out
      if (flowMode === 'CHECKOUT_BUY_NOW') {
        // Buy now - only clear checkoutData
        localStorage.removeItem('checkoutData');
      } else if (flowMode === 'CHECKOUT') {
        // Guest cart checkout - clear guest cart
        localStorage.removeItem('guest_cart');
      } else {
        // Normal user cart checkout - clear user cart
        clearCart();
      }

      // Always clear flow mode
      localStorage.removeItem('FLOW_MODE');

      router.push('/me/orders');
    } catch (err) {
      alert('Payment failed. Please try again.');
      setPaying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4 mb-6">
        {items.map(i => (
          <div key={i.productId} className="flex justify-between items-center">
            <span className="text-zinc-300">
              {i.name} × {i.quantity}
            </span>
            <span className="font-semibold">₹{i.price * i.quantity}</span>
          </div>
        ))}

        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={paying}
        className="w-full px-8 py-3 bg-zinc-200 text-black rounded-lg font-semibold hover:bg-zinc-300 transition disabled:opacity-50"
      >
        {paying ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}