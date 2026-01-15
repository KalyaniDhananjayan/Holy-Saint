'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [tshirt, setTshirt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product
  useEffect(() => {
    const fetchTshirt = async () => {
      try {
        const res = await fetch(
          `https://holy-saint-backend.onrender.com/api/v1/tshirts/${id}`,
          { cache: 'no-store' }
        );

        if (!res.ok) throw new Error('Failed to fetch product');

        const data = await res.json();
        setTshirt(data.data.tshirt);
      } catch (err) {
        setError('Could not load product');
      } finally {
        setLoading(false);
      }
    };

    fetchTshirt();
  }, [id]);

  const handleBuy = () => {
    if (!tshirt) return;

    const checkoutPayload = {
      items: [
        {
          productId: tshirt._id,
          name: tshirt.name,
          price: tshirt.price,
          quantity
        }
      ]
    };

    // Always set Buy Now flow mode and data
    localStorage.setItem('FLOW_MODE', 'CHECKOUT_BUY_NOW');
    localStorage.setItem('checkoutData', JSON.stringify(checkoutPayload));

    if (!user) {
      // User not logged in → redirect to login
      console.log('🛍️ Buy Now: Not logged in, redirecting to login');
      router.push('/login');
      return;
    }

    // User is logged in → go directly to checkout
    console.log('🛍️ Buy Now: Logged in, going to checkout');
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    if (!tshirt) return;

    addToCart({
      productId: tshirt._id,
      name: tshirt.name,
      price: tshirt.price,
      quantity
    });

    router.push('/cart');
  };

  if (loading) return <p className="text-center py-20">Loading product...</p>;
  if (error) return <p className="text-center py-20 text-red-400">{error}</p>;
  if (!tshirt) return <p className="text-center py-20">Product not found</p>;

  return (
    <div className="pt-8 pb-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
      <div className="aspect-square bg-zinc-800 rounded-xl overflow-hidden">
        <img
          src={tshirt.designImages[0]}
          alt={tshirt.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-4">{tshirt.name}</h1>
        <p className="text-zinc-400 mb-6">{tshirt.description}</p>
        <p className="text-3xl font-semibold mb-8">₹{tshirt.price}</p>

        <div className="flex items-center gap-4 mb-8">
          <input
            type="number"
            min="1"
            max={tshirt.stock}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Math.min(tshirt.stock, Number(e.target.value))))}
            className="w-24 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md"
          />
          <span className="text-zinc-400">{tshirt.stock} in stock</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleBuy}
            className="px-10 py-3 bg-zinc-200 text-black font-semibold rounded-lg hover:bg-zinc-300 transition"
          >
            BUY NOW
          </button>

          <button
            onClick={handleAddToCart}
            className="px-10 py-3 border border-zinc-600 text-zinc-200 font-semibold rounded-lg hover:bg-zinc-800 transition"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}