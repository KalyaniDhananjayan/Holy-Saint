'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (loading) return;

    // Frontend UX protection (backend already protects)
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          'https://holy-saint-backend.onrender.com/api/v1/orders',
          {
            credentials: 'include',
            cache: 'no-store'
          }
        );

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();
        setOrders(data.data.orders);
      } catch (err) {
        console.error(err);
        setError('Could not load orders');
      }
    };

    fetchOrders();
  }, [user, loading, router]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const res = await fetch(
        'https://holy-saint-backend.onrender.com/api/v1/orders/${orderId}/status',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!res.ok) throw new Error('Status update failed');

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      alert('Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="my-4">Admin Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map(order => (
        <div
          key={order._id}
          style={{
            border: '1px solid #434343ff',
            padding: '12px',
            marginTop: '9px',
            marginBottom: '6px'
          }}
        >
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>User:</strong> {order.user?.email}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>

          <label>
            <strong>Status:</strong>{' '}
            <select
              value={order.status}
              disabled={updatingId === order._id}
              onChange={e => updateStatus(order._id, e.target.value)}
              className="bg-zinc-700 text-white px-2 py-1 rounded border border-zinc-600 focus:outline-none"
            >
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <div style={{ marginTop: '8px' }}>
            <strong>Items:</strong>
            <ul>
              {order.items.map(item => (
                <li key={item._id}>
                  {item.tshirt.name} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
