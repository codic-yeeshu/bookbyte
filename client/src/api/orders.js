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
