/**
 * Distance Calculation Utilities
 *
 * This module provides utility functions for calculating distances between
 * geographical coordinates and estimating travel times.
 */

/**
 * Calculate distance between two points using the Haversine formula
 * The Haversine formula calculates the shortest distance between two points
 * on the surface of a sphere, approximating the Earth as a sphere.
 *
 * @param lat1 - Latitude of the first point in decimal degrees
 * @param lon1 - Longitude of the first point in decimal degrees
 * @param lat2 - Latitude of the second point in decimal degrees
 * @param lon2 - Longitude of the second point in decimal degrees
 * @returns Distance in kilometers
 */
export function calculateDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

/**
 * Convert degrees to radians
 *
 * @param deg - Angle in degrees
 * @returns Angle in radians
 */
export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate estimated travel time based on distance and average speed
 * Uses a deterministic approach to prevent re-renders while still providing realistic estimates
 *
 * @param distanceInKm - Distance in kilometers
 * @param avgSpeed - Average speed in km/h (defaults to 20 km/h for city traffic)
 * @returns Formatted time string (e.g. "15 min" or "2 hr 30 min")
 */
export function calculateEstimatedTime(
  distanceInKm: number,
  avgSpeed: number = 20
): string {
  // Use a more deterministic approach based on the distance itself
  // This ensures the same distance always produces the same time
  const trafficFactor = 1 + Math.sin(distanceInKm * 10) * 0.2; // Between 0.8 and 1.2 but deterministic

  // Calculate time in hours
  const timeInHours = (distanceInKm / avgSpeed) * trafficFactor;

  // Convert to minutes for shorter trips
  const timeInMinutes = timeInHours * 60;

  // Format the time
  if (timeInMinutes < 60) {
    return `${Math.round(timeInMinutes)} min`;
  } else {
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    return `${hours} hr ${minutes} min`;
  }
}

/**
 * Calculate total route distance from an array of coordinates
 *
 * @param coordinates - Array of [lat, lng] coordinate pairs
 * @returns Total distance in kilometers
 */
export function calculateRouteDistance(
  coordinates: [number, number][]
): number {
  let totalDistance = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lat1, lon1] = coordinates[i];
    const [lat2, lon2] = coordinates[i + 1];
    totalDistance += calculateDistanceInKm(lat1, lon1, lat2, lon2);
  }

  return totalDistance;
}

/**
 * Format a distance value with proper rounding and units
 *
 * @param distance - Distance in kilometers
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted distance string (e.g. "5.2 km")
 */
export function formatDistance(distance: number, decimals: number = 1): string {
  return `${distance.toFixed(decimals)} km`;
}
