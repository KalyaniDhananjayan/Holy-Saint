'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?._id;
  const pathname = usePathname();

  const [cart, setCart] = useState([]);
  const prevUserIdRef = useRef(null);
  const initialLoadRef = useRef(true);
  const checkoutVisitedRef = useRef(false);
  const justLoggedInRef = useRef(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // First load - just load appropriate cart
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      
      if (!userId) {
        // Not logged in - load guest cart
        const guest = JSON.parse(localStorage.getItem('guest_cart')) || [];
        console.log('📂 Initial load: Guest cart', guest);
        setCart(guest);
      } else {
        // Logged in - load user cart
        const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        console.log('📂 Initial load: User cart', userCart);
        setCart(userCart);
      }
      
      prevUserIdRef.current = userId;
      return;
    }

    const prevUserId = prevUserIdRef.current;
    const currentUserId = userId;

    // ----- User just LOGGED OUT -----
    if (prevUserId && !currentUserId) {
      console.log('👋 User logged out - clearing cart');
      setCart([]);
      prevUserIdRef.current = null;
      checkoutVisitedRef.current = false;
      justLoggedInRef.current = false;
      return;
    }

    // ----- User just LOGGED IN -----
    if (!prevUserId && currentUserId) {
      console.log('🔑 User just logged in');
      
      const flowMode = localStorage.getItem('FLOW_MODE');
      const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      const userCart = JSON.parse(localStorage.getItem(`cart_${currentUserId}`)) || [];

      console.log('🔍 Login context:', {
        flowMode,
        guestCartLength: guestCart.length,
        userCartLength: userCart.length,
        pathname
      });

      // Case 1: Logged in via checkout flow - preserve guest cart for checkout
      if (flowMode === 'CHECKOUT' || flowMode === 'CHECKOUT_BUY_NOW') {
        console.log('🛒 Login from checkout - loading user cart, preserving guest_cart');
        console.log('  Current pathname:', pathname);
        setCart(userCart);
        prevUserIdRef.current = currentUserId;
        justLoggedInRef.current = true; // Mark that we just logged in
        
        // Reset this flag after a short delay (after navigation completes)
        setTimeout(() => {
          justLoggedInRef.current = false;
          console.log('  justLoggedIn flag reset');
        }, 1000);
        
        return;
      }

      // Case 2: Normal login - merge carts (even if flowMode exists but we're not on checkout)
      console.log('🔄 Normal login - merging guest + user cart');
      const merged = [...userCart];

      if (guestCart.length > 0) {
        guestCart.forEach(gItem => {
          const existing = merged.find(i => i.productId === gItem.productId);
          if (existing) {
            console.log(`  Merging ${gItem.name}: ${existing.quantity} + ${gItem.quantity}`);
            existing.quantity += gItem.quantity;
          } else {
            console.log(`  Adding ${gItem.name} x${gItem.quantity}`);
            merged.push(gItem);
          }
        });

        // Save merged cart and clear guest cart
        localStorage.setItem(`cart_${currentUserId}`, JSON.stringify(merged));
        localStorage.removeItem('guest_cart');
        console.log('✅ Merge complete:', merged);
      } else {
        console.log('  No guest cart to merge');
      }

      // Clear flow mode if it exists and we're not on checkout
      if (flowMode && pathname !== '/checkout') {
        console.log('  Clearing stale FLOW_MODE');
        localStorage.removeItem('FLOW_MODE');
        localStorage.removeItem('checkoutData');
      }

      setCart(merged);
      prevUserIdRef.current = currentUserId;
      return;
    }

    // Update ref for next comparison
    prevUserIdRef.current = currentUserId;

  }, [userId, authLoading]);

  // Track when user visits checkout page
  useEffect(() => {
    if (pathname === '/checkout') {
      // Only mark as visited if we didn't just log in
      if (!justLoggedInRef.current) {
        checkoutVisitedRef.current = true;
        console.log('📍 Checkout page visited');
      } else {
        console.log('📍 Checkout page visited (just logged in, not counting as visit)');
        justLoggedInRef.current = false; // Reset the flag
      }
    }
  }, [pathname]);

  // Check for abandoned checkout when navigating away from checkout
  useEffect(() => {
    if (!user || authLoading) return;

    const flowMode = localStorage.getItem('FLOW_MODE');
    const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];

    console.log('🔍 Abandoned checkout check:', {
      checkoutVisited: checkoutVisitedRef.current,
      justLoggedIn: justLoggedInRef.current,
      pathname,
      flowMode,
      guestCartLength: guestCart.length
    });

    // Only merge if:
    // 1. User visited checkout page (and didn't just log in)
    // 2. User is no longer on checkout page
    // 3. Flow mode exists
    // 4. Guest cart still has items
    if (checkoutVisitedRef.current &&
        !justLoggedInRef.current &&
        pathname !== '/checkout' && 
        (flowMode === 'CHECKOUT' || flowMode === 'CHECKOUT_BUY_NOW') && 
        guestCart.length > 0) {
      
      console.log('⚠️ Checkout abandoned - merging guest cart into user cart');
      
      const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      const merged = [...userCart];

      guestCart.forEach(gItem => {
        const existing = merged.find(i => i.productId === gItem.productId);
        if (existing) {
          existing.quantity += gItem.quantity;
        } else {
          merged.push(gItem);
        }
      });

      // Save merged cart, clear guest cart and flow mode
      localStorage.setItem(`cart_${userId}`, JSON.stringify(merged));
      localStorage.removeItem('guest_cart');
      localStorage.removeItem('FLOW_MODE');
      localStorage.removeItem('checkoutData');
      
      setCart(merged);
      checkoutVisitedRef.current = false;
    } else {
      console.log('  ❌ Not merging - conditions not met');
    }
  }, [pathname, user, userId, authLoading]);

  const persist = (data) => {
    if (!userId) {
      localStorage.setItem('guest_cart', JSON.stringify(data));
    } else {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(data));
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      let updated;

      if (existing) {
        updated = prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        updated = [...prev, item];
      }

      persist(updated);
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const updated = prev.filter(i => i.productId !== productId);
      persist(updated);
      return updated;
    });
  };

  const clearCart = () => {
    if (!userId) {
      localStorage.removeItem('guest_cart');
    } else {
      localStorage.removeItem(`cart_${userId}`);
    }
    setCart([]);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        loading: authLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);