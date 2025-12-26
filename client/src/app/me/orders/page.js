'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          'http://localhost:5000/api/v1/orders/my-orders',
          {
            credentials: 'include',
            cache: 'no-store'
          }
        );

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();
        setOrders(data.data.orders);
      } catch (err) {
        setError('Could not load orders');
      }
    };

    fetchOrders();
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="py-14">
      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <p className="text-sm text-zinc-400">
              Order Total
            </p>

            <p className="text-2xl font-bold mt-1">
              ₹{order.totalAmount}
            </p>

            <p className="text-sm mt-3">
              Status: <span className="text-red-400">{order.status}</span>
            </p>
          </div>
        ))}
      </div>
    </div>


  );
}
