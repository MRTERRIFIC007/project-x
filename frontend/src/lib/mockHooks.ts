import { useState, useEffect } from "react";
import {
  AddOrderRequest,
  AddOrderResponse,
  ChatRequest,
  ChatResponse,
  GeocodeRequest,
  GeocodeResponse,
  OptimizeRouteRequest,
  OptimizeRouteResponse,
  PredictRequest,
  PredictResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "@/api/types";
import {
  mockPendingOrders,
  mockRealTimeData,
  mockOptimizeRouteResponse,
  mockPredictResponse,
} from "./mockData";

/**
 * Mock implementation of usePendingOrders
 */
export function useMockPendingOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const [data, setData] = useState(mockPendingOrders);

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setData(mockPendingOrders);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setData(mockPendingOrders);
      }, 800);
    },
  };
}

/**
 * Mock implementation of useRealTimeData
 */
export function useMockRealTimeData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const [data, setData] = useState(mockRealTimeData);

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setData(mockRealTimeData);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setData(mockRealTimeData);
      }, 1200);
    },
  };
}

/**
 * Mock implementation of useAddOrder
 */
export function useMockAddOrder() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<AddOrderResponse | null>(null);

  const mutate = (request: AddOrderRequest, options?: any) => {
    setIsPending(true);

    setTimeout(() => {
      const mockResponse: AddOrderResponse = {
        order_id: Math.floor(Math.random() * 10000).toString(),
        name: request.name,
        delivery_day: request.delivery_day,
        area: request.area,
        address: request.address,
        package_size: request.package_size,
        status: "Pending",
        created_at: new Date().toISOString(),
      };

      setData(mockResponse);
      setIsPending(false);

      if (options?.onSuccess) {
        options.onSuccess(mockResponse);
      }
    }, 1000);
  };

  return {
    mutate,
    isPending,
    error,
    data,
  };
}

/**
 * Mock implementation of useUpdateOrderStatus
 */
export function useMockUpdateOrderStatus() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<UpdateOrderStatusResponse | null>(null);

  const mutate = (
    request: { orderId: string; data: UpdateOrderStatusRequest },
    options?: any
  ) => {
    setIsPending(true);

    setTimeout(() => {
      const mockResponse: UpdateOrderStatusResponse = {
        success: true,
      };

      setData(mockResponse);
      setIsPending(false);

      if (options?.onSuccess) {
        options.onSuccess(mockResponse);
      }
    }, 800);
  };

  return {
    mutate,
    isPending,
    error,
    data,
  };
}

/**
 * Mock implementation of useMarkDelivered
 */
export function useMockMarkDelivered() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = (
    request: { orderId: string; success?: boolean },
    options?: any
  ) => {
    setIsPending(true);

    setTimeout(() => {
      setIsPending(false);

      if (options?.onSuccess) {
        options.onSuccess();
      }
    }, 800);
  };

  return {
    mutate,
    isPending,
    error,
  };
}

/**
 * Mock implementation of useChatbot
 */
export function useMockChatbot() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ChatResponse | null>(null);

  const mockResponses = [
    "The best time to deliver to Downtown today would be between 10:00-11:30 AM due to lower traffic congestion.",
    "Based on weather forecasts, expect possible delivery delays in the afternoon due to predicted heavy rainfall.",
    "There's a festival in the Downtown area today that might impact deliveries. Consider alternate routes.",
    "For large package deliveries, make sure to use the cargo elevator at 123 Main St building.",
    "I've checked the records and your delivery #10023 is currently in transit and expected to arrive by 3 PM.",
    "The most efficient route for your selected deliveries has been calculated and sent to your mobile app.",
    "You can reschedule a delivery by selecting the order in the pending orders list and choosing a new delivery date.",
    "I recommend considering the weather forecast for outdoor deliveries this week. There's a storm expected on Thursday.",
  ];

  const mutate = (request: ChatRequest, options?: any) => {
    setIsPending(true);

    setTimeout(() => {
      // Generate a contextually relevant response based on the request
      let response = "";

      if (
        request.message.toLowerCase().includes("time") ||
        request.message.toLowerCase().includes("when")
      ) {
        response = mockResponses[0];
      } else if (request.message.toLowerCase().includes("weather")) {
        response = mockResponses[1];
      } else if (
        request.message.toLowerCase().includes("festival") ||
        request.message.toLowerCase().includes("event")
      ) {
        response = mockResponses[2];
      } else if (
        request.message.toLowerCase().includes("package") ||
        request.message.toLowerCase().includes("large")
      ) {
        response = mockResponses[3];
      } else if (
        request.message.toLowerCase().includes("status") ||
        request.message.toLowerCase().includes("where")
      ) {
        response = mockResponses[4];
      } else if (
        request.message.toLowerCase().includes("route") ||
        request.message.toLowerCase().includes("path")
      ) {
        response = mockResponses[5];
      } else if (
        request.message.toLowerCase().includes("reschedule") ||
        request.message.toLowerCase().includes("change")
      ) {
        response = mockResponses[6];
      } else {
        // Default response for other queries
        response = mockResponses[7];
      }

      const mockResponse: ChatResponse = {
        response,
      };

      setData(mockResponse);
      setIsPending(false);

      if (options?.onSuccess) {
        options.onSuccess(mockResponse);
      }
    }, 1500); // Longer delay to simulate AI thinking
  };

  return {
    mutate,
    isPending,
    error,
    data,
  };
}

/**
 * Mock implementation of useOptimizeRoute
 */
export function useMockOptimizeRoute() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<OptimizeRouteResponse | null>(null);

  const mutate = (request: OptimizeRouteRequest, options?: any) => {
    setIsPending(true);

    setTimeout(() => {
      setData(mockOptimizeRouteResponse);
      setIsPending(false);

      if (options?.onSuccess) {
        options.onSuccess(mockOptimizeRouteResponse);
      }
    }, 2000); // Longer delay to simulate complex calculation
  };

  return {
    mutate,
    isPending,
    error,
    data,
  };
}

/**
 * Mock implementation of useGeocode
 */
export function useMockGeocode() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GeocodeResponse | null>(null);

  const mutate = (request: GeocodeRequest, options?: any) => {
    setIsPending(true);

    setTimeout(() => {
      const mockResponse: GeocodeResponse = {
        lat: 40.7128 + (Math.random() * 0.1 - 0.05),
        lon: -74.006 + (Math.random() * 0.1 - 0.05),
        display_name: request.address,
      };

      setData(mockResponse);
      setIsPending(false);

      if (options?.onSuccess) {
        options.onSuccess(mockResponse);
      }
    }, 1000);
  };

  return {
    mutate,
    isPending,
    error,
    data,
  };
}

/**
 * Mock implementation of usePredictDeliveryTime
 */
export function useMockPredictDeliveryTime() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<PredictResponse | null>(null);

  const mutate = (request: PredictRequest, options?: any) => {
    setIsPending(true);

    setTimeout(() => {
      const mockResponse = {
        ...mockPredictResponse,
        customer_name: request.name,
        day: request.day || "Today",
      };

      setData(mockResponse);
      setIsPending(false);

      if (options?.onSuccess) {
        options.onSuccess(mockResponse);
      }
    }, 1800); // Longer delay to simulate prediction calculation
  };

  return {
    mutate,
    isPending,
    error,
    data,
  };
}
