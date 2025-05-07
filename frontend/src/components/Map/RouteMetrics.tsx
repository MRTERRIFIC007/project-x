import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Route } from "lucide-react";

interface RouteMetricsProps {
  distance: number;
  estimatedTime: string;
  stops?: number;
  className?: string;
}

/**
 * Component to display route metrics (distance, time, stops)
 */
const RouteMetrics: React.FC<RouteMetricsProps> = ({
  distance,
  estimatedTime,
  stops,
  className = "",
}) => {
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Distance:</span>
            <Badge variant="outline" className="font-normal">
              {distance.toFixed(1)} km
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Est. Time:</span>
            <Badge variant="outline" className="font-normal">
              {estimatedTime}
            </Badge>
          </div>

          {stops !== undefined && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Stops:</span>
              <Badge variant="outline" className="font-normal">
                {stops}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteMetrics;
