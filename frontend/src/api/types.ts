// API Types based on API documentation

// Common types
export type Order = {
  order_id: string;
  name: string;
  delivery_day: string;
  area: string;
  address: string;
  package_size: string;
  status: string;
  created_at: string;
};

// Pending Orders
export type PendingOrdersResponse = Order[];

// Add Order
export type AddOrderRequest = {
  name: string;
  delivery_day: string;
  area: string;
  address: string;
  package_size: string;
};

export type AddOrderResponse = Order;

// Update Order Status
export type UpdateOrderStatusRequest = {
  status: string;
};

export type UpdateOrderStatusResponse = {
  success: boolean;
  error?: string;
  details?: string;
};

// Chatbot
export type ChatRequest = {
  message: string;
};

export type ChatResponse = {
  response: string;
  error?: string;
  details?: string;
};

// Route Optimization
export type OptimizeRouteRequest = {
  order_ids: string[];
};

export type OptimizedRouteStop = {
  order_id: string;
  address: string;
  customer: string;
};

export type OptimizeRouteResponse = {
  total_distance: number;
  estimated_time: string;
  route: OptimizedRouteStop[];
};

// Real-time Data
export type RealTimeDataParams = {
  type: "traffic" | "weather" | "festivals" | "all";
  area?: string;
};

export type WeatherData = {
  conditions: string;
  temperature: {
    current: number;
    min: number;
    max: number;
  };
  precipitation: {
    chance: number;
    type: string;
  };
  wind: {
    speed: number;
    direction: string;
  };
};

export type TrafficData = {
  congestion_level: string;
  status: string;
};

export type FestivalData = {
  name: string;
  impact: string;
};

export type RealTimeDataResponse = {
  weather?: WeatherData;
  traffic?: TrafficData;
  festivals?: FestivalData[];
  timestamp?: string;
  weather_summary?: string;
  traffic_summary?: string;
  festival_summary?: string;
};

// Geocoding
export type GeocodeRequest = {
  address: string;
};

export type GeocodeResponse = {
  lat: number;
  lon: number;
  display_name: string;
  error?: string;
};

// Delivery Time Prediction
export type PredictRequest = {
  name: string;
  day?: string;
  use_ml?: boolean;
};

export type PredictResponse = {
  customer_name: string;
  customer_area: string;
  day: string;
  optimal_times: string[];
  real_time_factors: {
    traffic: {
      congestion_level: string;
      status: string;
    };
    weather: {
      conditions: string;
      temperature: number;
      precipitation: number;
    };
    festival?: {
      name: string;
      impact: string;
    };
  };
};
