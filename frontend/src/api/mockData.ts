import { PredictResponse } from "./types";

// List of customers with more realistic data
export const customers = [
  { id: "1", name: "Aditya", area: "Satellite" },
  { id: "2", name: "Vivaan", area: "Bopal" },
  { id: "3", name: "Aarav", area: "Vastrapur" },
  { id: "4", name: "Meera", area: "Paldi" },
  { id: "5", name: "Diya", area: "Thaltej" },
  { id: "6", name: "Riya", area: "Navrangpura" },
  { id: "7", name: "Ananya", area: "Bodakdev" },
  { id: "8", name: "Aryan", area: "Gota" },
  { id: "9", name: "Ishaan", area: "Maninagar" },
  { id: "10", name: "Kabir", area: "Chandkheda" },
];

// Area-specific traffic patterns
const trafficPatterns = {
  Satellite: {
    morning: "High",
    afternoon: "Medium",
    evening: "High",
  },
  Bopal: {
    morning: "Medium",
    afternoon: "Low",
    evening: "Medium",
  },
  Vastrapur: {
    morning: "High",
    afternoon: "Medium",
    evening: "High",
  },
  Paldi: {
    morning: "Medium",
    afternoon: "Medium",
    evening: "High",
  },
  Thaltej: {
    morning: "High",
    afternoon: "Low",
    evening: "High",
  },
  Navrangpura: {
    morning: "High",
    afternoon: "High",
    evening: "Medium",
  },
  Bodakdev: {
    morning: "Medium",
    afternoon: "Low",
    evening: "High",
  },
  Gota: {
    morning: "Medium",
    afternoon: "Low",
    evening: "Medium",
  },
  Maninagar: {
    morning: "High",
    afternoon: "Medium",
    evening: "High",
  },
  Chandkheda: {
    morning: "Medium",
    afternoon: "Low",
    evening: "Medium",
  },
};

// Weather conditions by day
const weatherConditions = {
  Monday: { conditions: "Sunny", temperature: 38, precipitation: 0 },
  Tuesday: { conditions: "Partly Cloudy", temperature: 38, precipitation: 10 },
  Wednesday: { conditions: "Cloudy", temperature: 38, precipitation: 30 },
  Thursday: { conditions: "Light Rain", temperature: 38, precipitation: 50 },
  Friday: { conditions: "Sunny", temperature: 38, precipitation: 5 },
  Saturday: { conditions: "Clear", temperature: 38, precipitation: 0 },
  Sunday: { conditions: "Partly Cloudy", temperature: 38, precipitation: 15 },
  Today: { conditions: "Partly Cloudy", temperature: 38, precipitation: 20 },
};

// Festivals by day
const festivals = {
  Monday: null,
  Tuesday: null,
  Wednesday: { name: "Local Food Festival", impact: "Low" },
  Thursday: null,
  Friday: { name: "Weekend Market", impact: "Medium" },
  Saturday: { name: "City Cultural Festival", impact: "High" },
  Sunday: { name: "Weekend Market", impact: "Medium" },
  Today: { name: "Annual Downtown Festival", impact: "Medium" },
};

// Generate optimal delivery times based on traffic patterns and day
const generateOptimalTimes = (area: string, day: string): string[] => {
  const trafficPattern =
    trafficPatterns[area as keyof typeof trafficPatterns] ||
    trafficPatterns.Satellite;
  const times: string[] = [];

  // Add times when traffic is lower
  if (trafficPattern.morning !== "High") {
    times.push("9:30 AM - 11:00 AM");
  }

  if (trafficPattern.afternoon === "Low") {
    times.push("1:30 PM - 3:00 PM");
  } else if (trafficPattern.afternoon === "Medium") {
    times.push("2:00 PM - 3:30 PM");
  }

  if (trafficPattern.evening !== "High") {
    times.push("5:00 PM - 6:30 PM");
  }

  // If on weekend, add more flexible times
  if (day === "Saturday" || day === "Sunday") {
    times.push("11:30 AM - 1:00 PM");
  }

  // Ensure we have at least 2 time slots
  if (times.length < 2) {
    times.push("10:00 AM - 11:30 AM");
    times.push("4:00 PM - 5:30 PM");
  }

  return times;
};

// Generate traffic status based on area and congestion level
const generateTrafficStatus = (
  area: string,
  congestionLevel: string
): string => {
  if (congestionLevel === "High") {
    return `Heavy traffic in ${area} area due to rush hour`;
  } else if (congestionLevel === "Medium") {
    return `Moderate traffic in ${area} and surrounding areas`;
  } else {
    return `Light traffic in ${area} area, good for deliveries`;
  }
};

// Get mock prediction data
export const getMockPrediction = (
  customerName: string,
  day = "Today"
): PredictResponse => {
  // Find customer details
  const customer =
    customers.find((c) => c.name === customerName) || customers[0];
  const area = customer.area;

  // Get traffic pattern for this area
  const trafficPattern =
    trafficPatterns[area as keyof typeof trafficPatterns] ||
    trafficPatterns.Satellite;

  // Set congestion level based on time of day (use medium as default)
  const currentHour = new Date().getHours();
  let congestionTime = "afternoon";
  if (currentHour < 12) congestionTime = "morning";
  if (currentHour >= 17) congestionTime = "evening";

  const congestionLevel =
    trafficPattern[congestionTime as keyof typeof trafficPattern];

  // Get weather for the day
  const weather =
    weatherConditions[day as keyof typeof weatherConditions] ||
    weatherConditions.Today;

  // Get festival information
  const festival = festivals[day as keyof typeof festivals];

  // Generate optimal times
  const optimalTimes = generateOptimalTimes(area, day);

  // Create response
  const response: PredictResponse = {
    customer_name: customer.name,
    customer_area: customer.area,
    day: day,
    optimal_times: optimalTimes,
    real_time_factors: {
      traffic: {
        congestion_level: congestionLevel,
        status: generateTrafficStatus(area, congestionLevel),
      },
      weather: {
        conditions: weather.conditions,
        temperature: weather.temperature,
        precipitation: weather.precipitation,
      },
    },
  };

  // Add festival data if available
  if (festival) {
    response.real_time_factors.festival = festival;
  }

  return response;
};
