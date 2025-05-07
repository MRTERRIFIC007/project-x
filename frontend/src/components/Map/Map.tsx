import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";

// Fix for default marker icon issue in react-leaflet
// https://github.com/Leaflet/Leaflet/issues/4968
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Ahmedabad center coordinates
const defaultCenter = [23.0225, 72.5714];

interface LocationPoint {
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  address: string;
}

interface MapProps {
  route?: LocationPoint[];
  selectedPoints?: LocationPoint[];
  path?: [number, number][];
}

const Map = ({ route, selectedPoints, path }: MapProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    // If there are points to display, adjust the map view
    if (selectedPoints && selectedPoints.length > 0) {
      const bounds = new L.LatLngBounds(
        selectedPoints.map((point) => point.coordinates)
      );
      // Set the center to the center of the bounds
      setMapCenter([bounds.getCenter().lat, bounds.getCenter().lng]);
      // Adjust zoom level based on the number of points
      setZoom(selectedPoints.length === 1 ? 14 : 12);
    } else {
      // Reset to default view
      setMapCenter(defaultCenter);
      setZoom(12);
    }
  }, [selectedPoints]);

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display markers for selected points */}
        {selectedPoints &&
          selectedPoints.map((point, index) => (
            <Marker key={`marker-${index}`} position={point.coordinates}>
              <Popup>
                <div>
                  <strong>{point.name}</strong>
                  <p>{point.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Display polyline for path if available */}
        {path && path.length > 1 && (
          <Polyline positions={path} color="#3388ff" weight={4} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
