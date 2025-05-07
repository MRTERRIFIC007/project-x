import {
  PendingOrdersResponse,
  RealTimeDataResponse,
  WeatherData,
  TrafficData,
  FestivalData,
  OptimizeRouteResponse,
  OptimizedRouteStop,
  PredictResponse,
} from "@/api/types";

// Mock Pending Orders
export const mockPendingOrders: PendingOrdersResponse = [
  {
    order_id: "10001",
    name: "Aditya",
    delivery_day: "Monday",
    area: "Satellite",
    address: "Near Jodhpur Cross Road, Satellite, Ahmedabad - 380015",
    package_size: "Medium",
    status: "Pending",
    created_at: new Date().toISOString(),
  },
  {
    order_id: "10002",
    name: "Vivaan",
    delivery_day: "Wednesday",
    area: "Bopal",
    address: "Near Bopal Cross Road, Bopal, Ahmedabad - 380058",
    package_size: "Large",
    status: "Processing",
    created_at: new Date().toISOString(),
  },
  {
    order_id: "10003",
    name: "Aarav",
    delivery_day: "Friday",
    area: "Vastrapur",
    address: "Near Vastrapur Lake, Vastrapur, Ahmedabad - 380015",
    package_size: "Small",
    status: "Pending",
    created_at: new Date().toISOString(),
  },
  {
    order_id: "10004",
    name: "Meera",
    delivery_day: "Tuesday",
    area: "Paldi",
    address: "Opposite Dharnidhar Derasar, Paldi, Ahmedabad - 380007",
    package_size: "Medium",
    status: "Pending",
    created_at: new Date().toISOString(),
  },
  {
    order_id: "10005",
    name: "Diya",
    delivery_day: "Thursday",
    area: "Thaltej",
    address: "Near Thaltej Cross Road, S.G. Highway, Ahmedabad - 380054",
    package_size: "Large",
    status: "Processing",
    created_at: new Date().toISOString(),
  },
];

// Mock Weather Data
export const mockWeatherData: WeatherData = {
  conditions: "Partly Cloudy",
  temperature: {
    current: 38,
    min: 34,
    max: 41,
  },
  precipitation: {
    chance: 20,
    type: "Rain",
  },
  wind: {
    speed: 10,
    direction: "NE",
  },
};

// Mock Traffic Data
export const mockTrafficData: TrafficData = {
  congestion_level: "Medium",
  status: "Steady flow with occasional slowdowns",
};

// Mock Festival Data
export const mockFestivalData: FestivalData[] = [
  {
    name: "Summer Street Fair",
    impact: "Medium",
  },
  {
    name: "Downtown Food Festival",
    impact: "High",
  },
];

// Mock Real-time Data
export const mockRealTimeData: RealTimeDataResponse = {
  weather: mockWeatherData,
  traffic: mockTrafficData,
  festivals: mockFestivalData,
  timestamp: new Date().toISOString(),
  weather_summary:
    "Weather conditions are favorable for deliveries with a slight chance of afternoon rain.",
  traffic_summary:
    "Moderate traffic congestion in downtown areas during peak hours (8-10 AM, 4-6 PM).",
  festival_summary:
    "Two festivals in progress that may impact deliveries in the downtown area.",
};

// Mock Optimized Route Stops
export const mockOptimizedRouteStops: OptimizedRouteStop[] = [
  {
    order_id: "10002",
    address: "Near Bopal Cross Road, Bopal, Ahmedabad - 380058",
    customer: "Vivaan",
  },
  {
    order_id: "10001",
    address: "Near Jodhpur Cross Road, Satellite, Ahmedabad - 380015",
    customer: "Aditya",
  },
  {
    order_id: "10003",
    address: "Near Vastrapur Lake, Vastrapur, Ahmedabad - 380015",
    customer: "Aarav",
  },
];

// Mock Optimized Route
export const mockOptimizeRouteResponse: OptimizeRouteResponse = {
  total_distance: 15.3,
  estimated_time: "90 minutes",
  route: mockOptimizedRouteStops,
};

// Mock Prediction Response
export const mockPredictResponse: PredictResponse = {
  customer_name: "Aditya",
  customer_area: "Satellite",
  day: "Monday",
  optimal_times: ["9:00-10:00", "14:00-15:00", "17:00-18:00"],
  real_time_factors: {
    traffic: {
      congestion_level: "Medium",
      status: "Flowing with some congestion in Satellite area",
    },
    weather: {
      conditions: "Mostly Sunny",
      temperature: 38,
      precipitation: 5,
    },
    festival: {
      name: "Ahmedabad Heritage Festival",
      impact: "Medium",
    },
  },
};
