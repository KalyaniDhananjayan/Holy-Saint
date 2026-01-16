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

  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!shippingAddress.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (shippingAddress.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Phone validation
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    // Address validation
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (shippingAddress.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    // City validation
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    } else if (shippingAddress.city.trim().length < 2) {
      newErrors.city = 'Enter a valid city name';
    }

    // State validation
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    } else if (shippingAddress.state.trim().length < 2) {
      newErrors.state = 'Enter a valid state name';
    }

    // Pincode validation
    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

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
    if (!validateForm()) {
      return;
    }

    setPaying(true);

    try {
      const res = await fetch('https://holy-saint-backend.onrender.com/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: items.map(i => ({ tshirt: i.productId, quantity: i.quantity })),
          shippingAddress,
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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Address Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={shippingAddress.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 bg-zinc-900 border ${
                  errors.name ? 'border-red-500' : 'border-zinc-700'
                } rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                className={`w-full px-4 py-2 bg-zinc-900 border ${
                  errors.phone ? 'border-red-500' : 'border-zinc-700'
                } rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400`}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <textarea
                name="address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                placeholder="House No., Building Name, Street, Area"
                rows="3"
                className={`w-full px-4 py-2 bg-zinc-900 border ${
                  errors.address ? 'border-red-500' : 'border-zinc-700'
                } rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 resize-none`}
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                className={`w-full px-4 py-2 bg-zinc-900 border ${
                  errors.city ? 'border-red-500' : 'border-zinc-700'
                } rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400`}
              />
              {errors.city && (
                <p className="text-red-400 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
                className={`w-full px-4 py-2 bg-zinc-900 border ${
                  errors.state ? 'border-red-500' : 'border-zinc-700'
                } rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400`}
              />
              {errors.state && (
                <p className="text-red-400 text-sm mt-1">{errors.state}</p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium mb-1">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleInputChange}
                placeholder="6-digit pincode"
                maxLength="6"
                className={`w-full px-4 py-2 bg-zinc-900 border ${
                  errors.pincode ? 'border-red-500' : 'border-zinc-700'
                } rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400`}
              />
              {errors.pincode && (
                <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
            {items.map(i => (
              <div key={i.productId} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-zinc-400">Qty: {i.quantity}</p>
                </div>
                <span className="font-semibold">₹{i.price * i.quantity}</span>
              </div>
            ))}

            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-zinc-800">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full mt-4 px-8 py-3 bg-zinc-200 text-black rounded-lg font-semibold hover:bg-zinc-300 transition disabled:opacity-50"
            >
              {paying ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}