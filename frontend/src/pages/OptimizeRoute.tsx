import { useState, useMemo } from "react";
import { useOptimizeRoute } from "@/api/mutations";
import { usePendingOrders } from "@/api/queries";
import { OptimizedRouteStop } from "@/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CheckCircleIcon,
  MapIcon,
  MapPinIcon,
  PackageIcon,
} from "lucide-react";
import { RouteMap } from "@/components/Map";

export default function OptimizeRoute() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<
    OptimizedRouteStop[] | null
  >(null);
  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const { data: pendingOrders, isLoading: isLoadingOrders } =
    usePendingOrders();
  const optimizeRouteMutation = useOptimizeRoute();

  // Toggle order selection
  const toggleOrderSelection = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Find optimized route
  const findOptimizedRoute = () => {
    if (selectedOrders.length < 2) {
      toast.error("Please select at least 2 orders to optimize the route");
      return;
    }

    optimizeRouteMutation.mutate(
      { order_ids: selectedOrders },
      {
        onSuccess: (data) => {
          setOptimizedRoute(data.route);
          setTotalDistance(data.total_distance);
          setEstimatedTime(data.estimated_time);
          setShowMap(true);
          toast.success("Route optimization completed successfully!");
        },
        onError: (error) => {
          toast.error("Failed to optimize route", {
            description: error.message,
          });
        },
      }
    );
  };

  // Helper function to get coordinates based on the address
  const getCoordinatesForAddress = (address: string): [number, number] => {
    // This is a simplified mock implementation
    const areaMap: Record<string, [number, number]> = {
      Satellite: [23.0171, 72.529],
      Bopal: [23.04, 72.47],
      Vastrapur: [23.0373, 72.5344],
      Paldi: [23.0124, 72.5663],
      Thaltej: [23.0509, 72.5067],
      Navrangpura: [23.0301, 72.5567],
      Bodakdev: [23.0457, 72.5112],
      Gota: [23.1007, 72.5148],
      Maninagar: [22.9962, 72.6012],
      Chandkheda: [23.1052, 72.5822],
    };

    // Check if the address contains any of the known areas
    for (const [area, coords] of Object.entries(areaMap)) {
      if (address.includes(area)) {
        return coords;
      }
    }

    // Default to Ahmedabad center if no match
    return [23.0225, 72.5714];
  };

  // Memoize the route points to prevent unnecessary recalculations
  const routePoints = useMemo(() => {
    if (!optimizedRoute) return undefined;

    return optimizedRoute.map((stop) => ({
      name: stop.customer,
      coordinates: getCoordinatesForAddress(stop.address),
      address: stop.address,
    }));
  }, [optimizedRoute]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Find Optimized Delivery Path</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`${showMap ? "lg:col-span-1" : "lg:col-span-3"}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-primary" />
                Pending Orders
              </CardTitle>
              <CardDescription>
                Select orders to include in the route optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="py-8 text-center">
                  Loading pending orders...
                </div>
              ) : pendingOrders && pendingOrders.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedOrders.length} of {pendingOrders.length} orders
                      selected
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedOrders.length === pendingOrders.length) {
                          setSelectedOrders([]);
                        } else {
                          setSelectedOrders(
                            pendingOrders.map((order) => order.order_id)
                          );
                        }
                      }}
                    >
                      {selectedOrders.length === pendingOrders.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>

                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    {pendingOrders.map((order) => (
                      <div
                        key={order.order_id}
                        className={`mb-3 p-3 border rounded-md ${
                          selectedOrders.includes(order.order_id)
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedOrders.includes(order.order_id)}
                              onCheckedChange={() =>
                                toggleOrderSelection(order.order_id)
                              }
                              id={`order-${order.order_id}`}
                              className="mt-1"
                            />
                            <div>
                              <label
                                htmlFor={`order-${order.order_id}`}
                                className="text-base font-medium cursor-pointer"
                              >
                                {order.name}
                              </label>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPinIcon className="h-3 w-3" />
                                {order.area}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {order.address}
                              </p>
                            </div>
                          </div>
                          <Badge>{order.package_size}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full"
                      onClick={findOptimizedRoute}
                      disabled={
                        selectedOrders.length < 2 ||
                        optimizeRouteMutation.isPending
                      }
                    >
                      {optimizeRouteMutation.isPending
                        ? "Calculating..."
                        : "Find Optimized Route"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No pending orders available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showMap && (
          <div className="lg:col-span-2">
            <RouteMap
              routePoints={routePoints}
              title="Optimized Delivery Route"
              description={
                <div>
                  The most efficient delivery path for your selected orders
                </div>
              }
            />

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setShowMap(false)}>
                Edit Selections
              </Button>
              <Button
                onClick={() => {
                  toast.success("Route has been exported and sent to driver", {
                    icon: <CheckCircleIcon className="h-5 w-5" />,
                  });
                }}
              >
                Export Route
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
