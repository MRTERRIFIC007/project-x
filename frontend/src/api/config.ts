// API Configuration

export const API_BASE_URL = "http://localhost:5002";

export const ENDPOINTS = {
  PENDING_ORDERS: "/pending_orders",
  ADD_ORDER: "/add_order",
  UPDATE_ORDER_STATUS: (orderId: string) => `/update_order_status/${orderId}`,
  MARK_DELIVERED: (orderId: string) => `/mark_delivered/${orderId}`,
  CHAT: "/chat",
  OPTIMIZE_ROUTE: "/optimize_route",
  REAL_TIME_DATA: "/real_time_data",
  GEOCODE: "/geocode",
  PREDICT: "/predict",
};

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export const DEFAULT_OPTIONS = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  cacheTime: 1000 * 60 * 30, // 30 minutes
};
