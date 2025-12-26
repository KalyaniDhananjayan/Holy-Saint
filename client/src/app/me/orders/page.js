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
          'https://holy-saint-backend.onrender.com/api/v1/orders/my-orders',
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
      <h1 className="text-3xl font-medium mb-8">
        My Orders
      </h1>

      <div className="space-y-8">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            {/* Order items */}
            <div className="space-y-4">
              {order.items.map(item => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.tshirt?.designImages?.[0] ? (
                      <img
                        src={item.tshirt.designImages[0]}
                        alt={item.tshirt.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-zinc-500">
                        IMAGE
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <p className="font-semibold">
                      {item.tshirt?.name}
                    </p>

                    <p className="text-sm text-zinc-400">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  Order Total
                </p>
                <p className="text-2xl font-medium">
                  ₹{order.totalAmount}
                </p>
              </div>

              <span className="px-3 py-1 text-sm border border-zinc-700 rounded-md text-zinc-300">
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
