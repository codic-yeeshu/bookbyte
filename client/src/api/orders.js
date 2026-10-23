import api from './axios';

// Admin specific APIs
export const getAllOrders = async () => {
  const response = await api.get('/order/get-all-orders');
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/order/update-status/${orderId}`, { status });
  return response.data;
};

// Common APIs
export const placeOrder = async (orderItems) => {
  const response = await api.post('/order/place-order', { order: orderItems });
  return response.data;
};

export const getOrderHistory = async () => {
  const response = await api.get('/order/get-order-history');
  return response.data;
};

const STATUS_KEYS = {
  'Order Placed': 'placed',
  'Out for delivery': 'out-for-delivery',
  Delivered: 'delivered',
  Canceled: 'cancelled',
};

// TODO(#19): today each order holds a single book and history fails without the `id` header (#5).
// Map what the API returns into the #19 shape; fall back to sample orders when it can't be read.
export const getRecentOrders = async () => {
  try {
    const { data = [] } = await getOrderHistory();
    return {
      sample: false,
      data: data.map((o) => ({
        _id: o._id,
        number: `BB-${o._id.slice(-5).toUpperCase()}`,
        createdAt: o.createdAt,
        titles: o.book ? [o.book.title] : [],
        total: o.book?.price ?? 0,
        status: STATUS_KEYS[o.status] ?? 'placed',
      })),
    };
  } catch (err) {
    console.warn('Order history unavailable, showing sample orders.', err);
    const { SAMPLE_ORDERS } = await import('../mocks/orders');
    return { sample: true, data: SAMPLE_ORDERS };
  }
};
