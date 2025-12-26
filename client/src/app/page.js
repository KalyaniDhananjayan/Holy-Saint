'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [tshirts, setTshirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTshirts = async () => {
      try {
        const res = await fetch(
          'http://localhost:5000/api/v1/tshirts',
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch t-shirts');
        }

        const data = await res.json();
        setTshirts(data.data.tshirts);
      } catch (err) {
        console.error(err);
        setError('Could not load t-shirts');
      } finally {
        setLoading(false); // 🔥 ALWAYS runs
      }
    };

    fetchTshirts();
  }, []);

  if (loading) return <p>Loading T-shirts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="py-14">

    {/* <h1 className="text-4xl font-bold tracking-wide mb-10">
      NEW ARRIVALS
    </h1> */}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {tshirts.map(product => (
        <Link
          key={product._id}
          href={`/product/${product._id}`}
          className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-400 transition"
        >

          {/* Image placeholder */}
          <div className="h-64 bg-zinc-800 rounded-lg mb-5 flex items-center justify-center text-zinc-300 text-sm">
            PRODUCT IMAGE
          </div>

          <h2 className="text-lg font-semibold group-hover:text-zinc-400 transition">
            {product.name}
          </h2>

          <p className="text-zinc-400 mt-1">
            ₹{product.price}
          </p>

        </Link>
      ))}
    </div>

  </div>
  );
}