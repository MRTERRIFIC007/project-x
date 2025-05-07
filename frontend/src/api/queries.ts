import { createQuery } from "react-query-kit";
import { API_BASE_URL, ENDPOINTS, DEFAULT_OPTIONS } from "./config";
import {
  PendingOrdersResponse,
  RealTimeDataParams,
  RealTimeDataResponse,
} from "./types";

/**
 * Hook to fetch all pending orders
 */
export const usePendingOrders = createQuery<PendingOrdersResponse, void, Error>(
  {
    queryKey: ["pending-orders"],
    fetcher: async () => {
      const response = await fetch(
        `${API_BASE_URL}${ENDPOINTS.PENDING_ORDERS}`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching pending orders: ${response.statusText}`
        );
      }
      return response.json();
    },
    ...DEFAULT_OPTIONS,
  }
);

/**
 * Hook to fetch real-time data (weather, traffic, festivals)
 */
export const useRealTimeData = createQuery<
  RealTimeDataResponse,
  RealTimeDataParams,
  Error
>({
  queryKey: ["real-time-data"],
  fetcher: async (params) => {
    const queryParams = new URLSearchParams();
    queryParams.append("type", params.type);
    if (params.area) {
      queryParams.append("area", params.area);
    }

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.REAL_TIME_DATA}?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching real-time data: ${response.statusText}`);
    }

    return response.json();
  },
  ...DEFAULT_OPTIONS,
});
