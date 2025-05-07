import { ReactNode, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { MapIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapView from "./MapView";
import RouteMetrics from "./RouteMetrics";
import "./Map.css";
import {
  calculateDistanceInKm,
  calculateEstimatedTime,
  formatDistance,
} from "@/lib/distance-utils";
import {
  useRouteCalculation,
  LocationPoint,
} from "@/hooks/useRouteCalculation";

// Fix for default marker icon issues in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Setup default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Ahmedabad center coordinates
const ahmedabadCenter: [number, number] = [23.0225, 72.5714];

// Mock data for Ahmedabad areas based on the backend data
const ahmedabadAreas = [
  {
    name: "Satellite",
    coordinates: [23.0171, 72.529],
    address: "Near Jodhpur Cross Road, Satellite, Ahmedabad - 380015",
  },
  {
    name: "Bopal",
    coordinates: [23.04, 72.47],
    address: "Near Bopal Cross Road, Bopal, Ahmedabad - 380058",
  },
  {
    name: "Vastrapur",
    coordinates: [23.0373, 72.5344],
    address: "Near Vastrapur Lake, Vastrapur, Ahmedabad - 380015",
  },
  {
    name: "Paldi",
    coordinates: [23.0124, 72.5663],
    address: "Opposite Dharnidhar Derasar, Paldi, Ahmedabad - 380007",
  },
  {
    name: "Thaltej",
    coordinates: [23.0509, 72.5067],
    address: "Near Thaltej Cross Road, S.G. Highway, Ahmedabad - 380054",
  },
  {
    name: "Navrangpura",
    coordinates: [23.0301, 72.5567],
    address: "Near Navrangpura AMTS Bus Stop, Navrangpura, Ahmedabad - 380009",
  },
  {
    name: "Bodakdev",
    coordinates: [23.0457, 72.5112],
    address: "Opposite Rajpath Club, Bodakdev, Ahmedabad - 380054",
  },
  {
    name: "Gota",
    coordinates: [23.1007, 72.5148],
    address: "Near Oganaj Gam, Gota, Ahmedabad - 382481",
  },
  {
    name: "Maninagar",
    coordinates: [22.9962, 72.6012],
    address: "Opposite Rambaug Police Station, Maninagar, Ahmedabad - 380008",
  },
  {
    name: "Chandkheda",
    coordinates: [23.1052, 72.5822],
    address: "Near Chandkheda Gam Bus Stop, Chandkheda, Ahmedabad - 382424",
  },
];

interface RouteMapProps {
  routePoints?: LocationPoint[];
  title?: string | ReactNode;
  description?: string | ReactNode;
  className?: string;
}

// Generate a random route using 3-5 points from ahmedabadAreas
function getRandomRoute(): LocationPoint[] {
  const numPoints = Math.floor(Math.random() * 3) + 3; // 3 to 5 points
  const shuffled = [...ahmedabadAreas].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPoints);
}

const RouteMap = ({
  routePoints,
  title = "Optimized Delivery Route",
  description = "The most efficient delivery path",
  className,
}: RouteMapProps) => {
  // Memoize the default route so it doesn't change on every render
  const defaultRoute = useMemo(() => getRandomRoute(), []);

  // Use our custom hook for route calculations
  const { selectedPoints, path, totalDistance, estimatedTime, isCalculating } =
    useRouteCalculation(routePoints, defaultRoute);

  return (
    <div className="space-y-4">
      <RouteMetrics
        distance={totalDistance}
        estimatedTime={estimatedTime}
        stops={selectedPoints.length}
      />

      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="map-container">
            <MapContainer
              center={ahmedabadCenter}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Automatically center map on the route */}
              <MapView selectedPoints={selectedPoints} />

              {/* Display markers for each point */}
              {selectedPoints.map((point, index) => (
                <Marker key={`marker-${index}`} position={point.coordinates}>
                  <Popup>
                    <div>
                      <strong>{point.name}</strong>
                      <p>{point.address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Stop {index + 1} of {selectedPoints.length}
                      </p>
                      {index < selectedPoints.length - 1 && (
                        <p className="text-xs font-medium mt-1">
                          Next stop:{" "}
                          {formatDistance(
                            calculateDistanceInKm(
                              point.coordinates[0],
                              point.coordinates[1],
                              selectedPoints[index + 1].coordinates[0],
                              selectedPoints[index + 1].coordinates[1]
                            )
                          )}
                          (
                          {calculateEstimatedTime(
                            calculateDistanceInKm(
                              point.coordinates[0],
                              point.coordinates[1],
                              selectedPoints[index + 1].coordinates[0],
                              selectedPoints[index + 1].coordinates[1]
                            )
                          )}
                          )
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Display polyline connecting all points */}
              {path.length > 1 && (
                <Polyline
                  positions={path}
                  color="#3388ff"
                  weight={4}
                  opacity={0.7}
                />
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteMap;
