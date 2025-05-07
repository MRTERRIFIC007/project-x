import { createMutation } from "react-query-kit";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from "./config";
import {
  AddOrderRequest,
  AddOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  ChatRequest,
  ChatResponse,
  OptimizeRouteRequest,
  OptimizeRouteResponse,
  GeocodeRequest,
  GeocodeResponse,
  PredictRequest,
  PredictResponse,
} from "./types";

/**
 * Hook to add a new order
 */
export const useAddOrder = createMutation<
  AddOrderResponse,
  AddOrderRequest,
  Error
>({
  mutationKey: ["add-order"],
  mutationFn: async (data) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADD_ORDER}`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error adding order: ${response.statusText}`);
    }

    return response.json();
  },
});

/**
 * Hook to update order status
 */
export const useUpdateOrderStatus = createMutation<
  UpdateOrderStatusResponse,
  { orderId: string; data: UpdateOrderStatusRequest },
  Error
>({
  mutationKey: ["update-order-status"],
  mutationFn: async ({ orderId, data }) => {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.UPDATE_ORDER_STATUS(orderId)}`,
      {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating order status: ${response.statusText}`);
    }

    return response.json();
  },
});

/**
 * Hook to mark an order as delivered
 */
export const useMarkDelivered = createMutation<
  void,
  { orderId: string; success?: boolean },
  Error
>({
  mutationKey: ["mark-delivered"],
  mutationFn: async ({ orderId, success = true }) => {
    const url = new URL(`${API_BASE_URL}${ENDPOINTS.MARK_DELIVERED(orderId)}`);
    url.searchParams.append("success", success.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Error marking order as delivered: ${response.statusText}`
      );
    }

    return;
  },
});

/**
 * Hook for chatbot interaction
 */
export const useChatbot = createMutation<ChatResponse, ChatRequest, Error>({
  mutationKey: ["chat"],
  mutationFn: async (data) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CHAT}`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error sending chat message: ${response.statusText}`);
    }

    return response.json();
  },
});

/**
 * Hook for route optimization
 */
export const useOptimizeRoute = createMutation<
  OptimizeRouteResponse,
  OptimizeRouteRequest,
  Error
>({
  mutationKey: ["optimize-route"],
  mutationFn: async (data) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.OPTIMIZE_ROUTE}`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error optimizing route: ${response.statusText}`);
    }

    return response.json();
  },
});

/**
 * Hook for geocoding addresses
 */
export const useGeocode = createMutation<
  GeocodeResponse,
  GeocodeRequest,
  Error
>({
  mutationKey: ["geocode"],
  mutationFn: async (data) => {
    const formData = new FormData();
    formData.append("address", data.address);

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GEOCODE}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error geocoding address: ${response.statusText}`);
    }

    return response.json();
  },
});

/**
 * Hook for delivery time prediction
 */
export const usePredictDeliveryTime = createMutation<
  PredictResponse,
  PredictRequest,
  Error
>({
  mutationKey: ["predict"],
  mutationFn: async (data) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PREDICT}`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error predicting delivery time: ${response.statusText}`);
    }

    return response.json();
  },
});
