import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MapViewProps {
  selectedPoints?: {
    coordinates: [number, number];
  }[];
}

// This component automatically adjusts the map view based on the selected points
const MapView = ({ selectedPoints }: MapViewProps) => {
  const map = useMap();

  useEffect(() => {
    if (!selectedPoints || selectedPoints.length === 0) return;

    const bounds = L.latLngBounds(selectedPoints.map((p) => p.coordinates));

    // Add some padding around the bounds to make sure all markers are visible
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [map, selectedPoints]);

  return null; // This is just a utility component that doesn't render anything
};

export default MapView;
