'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [tshirt, setTshirt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const fetchTshirt = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/tshirts/${id}`,
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

  const handleBuy = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setBuying(true);

    const res = await fetch(
      'http://localhost:5000/api/v1/orders',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: [
            {
              tshirt: tshirt._id,
              quantity
            }
          ]
        })
      }
    );

    setBuying(false);

    if (!res.ok) {
      alert('Order failed');
      return;
    }

    router.push('/me/orders');
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!tshirt) return <p>Product not found</p>;

 return (
    <div className="py-16 grid grid-cols-1 md:grid-cols-2 gap-14">

    {/* Image */}
    <div className="h-[440px] bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
      PRODUCT IMAGE
    </div>

    {/* Details */}
    <div>
      <h1 className="text-4xl font-bold mb-4">
        {tshirt.name}
      </h1>

      <p className="text-zinc-400 mb-6">
        {tshirt.description}
      </p>

      <p className="text-3xl font-semibold mb-8">
        ₹{tshirt.price}
      </p>

      <div className="flex items-center gap-4 mb-8">
        <input
          type="number"
          min="1"
          max={tshirt.stock}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="w-24 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md"
        />

        <span className="text-zinc-400">
          {tshirt.stock} in stock
        </span>
      </div>

      <button
        onClick={handleBuy}
        disabled={buying}
        className="px-10 py-3 bg-zinc-100 text-black font-semibold rounded-lg hover:bg-zinc-400 transition disabled:opacity-50"
      >
        {buying ? 'Processing...' : 'BUY NOW'}
      </button>
    </div>

  </div>

);
}
