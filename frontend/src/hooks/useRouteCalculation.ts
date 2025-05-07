import { useState, useEffect, useRef } from "react";
import {
  calculateRouteDistance,
  calculateEstimatedTime,
} from "@/lib/distance-utils";

export interface LocationPoint {
  name: string;
  coordinates: [number, number];
  address: string;
}

interface RouteCalculationResult {
  selectedPoints: LocationPoint[];
  path: [number, number][];
  totalDistance: number;
  estimatedTime: string;
  isCalculating: boolean;
}

/**
 * Custom hook for calculating route metrics between points
 *
 * @param points - Array of location points
 * @param defaultPoints - Optional fallback points if main points are empty
 * @returns Route calculation result with path, distance and time
 */
export function useRouteCalculation(
  points?: LocationPoint[],
  defaultPoints?: LocationPoint[]
): RouteCalculationResult {
  const [selectedPoints, setSelectedPoints] = useState<LocationPoint[]>([]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Use refs to compare arrays for deep equality
  const prevPointsRef = useRef<LocationPoint[] | undefined>();
  const prevDefaultPointsRef = useRef<LocationPoint[] | undefined>();

  useEffect(() => {
    // Check if points or defaultPoints have actually changed
    const pointsChanged = !areArraysEqual(prevPointsRef.current, points);
    const defaultPointsChanged = !areArraysEqual(
      prevDefaultPointsRef.current,
      defaultPoints
    );

    // Only recalculate if the data has actually changed
    if (!pointsChanged && !defaultPointsChanged) {
      return;
    }

    // Update the refs
    prevPointsRef.current = points;
    prevDefaultPointsRef.current = defaultPoints;

    setIsCalculating(true);

    try {
      let routePoints: LocationPoint[];

      if (points && points.length > 0) {
        routePoints = [...points]; // Create a copy to avoid reference issues
      } else if (defaultPoints && defaultPoints.length > 0) {
        // Use default points as fallback
        routePoints = [...defaultPoints]; // Create a copy to avoid reference issues
      } else {
        // No points available
        setSelectedPoints([]);
        setPath([]);
        setTotalDistance(0);
        setEstimatedTime("");
        setIsCalculating(false);
        return;
      }

      // Create a path between all points for the polyline
      const pathCoordinates = routePoints.map((point) => point.coordinates);

      // Calculate total distance along the route
      const distance = calculateRouteDistance(pathCoordinates);

      // Round to 1 decimal place
      const roundedDistance = Math.round(distance * 10) / 10;

      // Calculate estimated time
      const time = calculateEstimatedTime(distance);

      // Batch state updates to reduce renders
      setSelectedPoints(routePoints);
      setPath(pathCoordinates);
      setTotalDistance(roundedDistance);
      setEstimatedTime(time);
    } catch (error) {
      console.error("Error calculating route:", error);
      // Set fallback values
      setTotalDistance(0);
      setEstimatedTime("N/A");
    } finally {
      setIsCalculating(false);
    }
  }, [points, defaultPoints]);

  // Helper function to compare arrays for deep equality
  function areArraysEqual(
    arr1?: LocationPoint[],
    arr2?: LocationPoint[]
  ): boolean {
    if (!arr1 && !arr2) return true;
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;

    // Simple check for object equality - not comprehensive but sufficient for this case
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  return {
    selectedPoints,
    path,
    totalDistance,
    estimatedTime,
    isCalculating,
  };
}
