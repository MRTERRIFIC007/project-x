import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PredictResponse } from "@/api/types";
import { customers, getMockPrediction } from "@/api/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CalendarIcon,
  ClockIcon,
  CloudRainWind,
  Loader2,
  PartyPopperIcon,
  TruckIcon,
} from "lucide-react";

// Form schema for prediction
const predictionSchema = z.object({
  name: z.string().min(1, { message: "Please select a customer" }),
  day: z.string().optional(),
});

export default function DeliveryPrediction() {
  const [predictionResult, setPredictionResult] =
    useState<PredictResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof predictionSchema>>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      name: "",
      day: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof predictionSchema>) => {
    try {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get mock prediction data for selected customer and day
      const mockData = getMockPrediction(data.name, data.day || "Today");

      setPredictionResult(mockData);
      toast.success("Delivery time prediction completed!");
    } catch (error) {
      console.error("Error in prediction:", error);
      toast.error("An error occurred while processing the prediction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery Time Prediction</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-primary" />
                Predict Optimal Time
              </CardTitle>
              <CardDescription>
                Find the best time to deliver to a customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem
                                key={customer.id}
                                value={customer.name}
                              >
                                {customer.name} ({customer.area})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Today (default)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Predict Best Delivery Time"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {predictionResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Optimal Delivery Times</CardTitle>
                <CardDescription>
                  For {predictionResult.customer_name} in{" "}
                  {predictionResult.customer_area} on {predictionResult.day}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Optimal times visualization */}
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-primary" />
                      Recommended Time Windows
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {predictionResult.optimal_times.map((time, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border rounded-md border-primary bg-primary/5"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                            {index + 1}
                          </div>
                          <div className="text-lg font-medium">{time}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-time factors */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Real-time Factors Affecting Delivery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Weather card */}
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <CloudRainWind className="h-4 w-4 text-primary" />
                            Weather
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {
                                  predictionResult.real_time_factors.weather
                                    .conditions
                                }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Precipitation:{" "}
                                {
                                  predictionResult.real_time_factors.weather
                                    .precipitation
                                }
                                %
                              </p>
                            </div>
                            <p className="text-2xl font-bold">
                              {
                                predictionResult.real_time_factors.weather
                                  .temperature
                              }
                              °C
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Traffic card */}
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <TruckIcon className="h-4 w-4 text-primary" />
                            Traffic
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              {
                                predictionResult.real_time_factors.traffic
                                  .status
                              }
                            </p>
                            <p
                              className={`font-bold ${
                                predictionResult.real_time_factors.traffic
                                  .congestion_level === "High"
                                  ? "text-destructive"
                                  : predictionResult.real_time_factors.traffic
                                      .congestion_level === "Medium"
                                  ? "text-amber-500"
                                  : "text-green-500"
                              }`}
                            >
                              {
                                predictionResult.real_time_factors.traffic
                                  .congestion_level
                              }
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Festival/Event card (if available) */}
                      {predictionResult.real_time_factors.festival && (
                        <Card className="bg-muted/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <PartyPopperIcon className="h-4 w-4 text-primary" />
                              Festival/Event
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <p className="font-medium">
                                {
                                  predictionResult.real_time_factors.festival
                                    .name
                                }
                              </p>
                              <p
                                className={`font-bold ${
                                  predictionResult.real_time_factors.festival
                                    .impact === "High"
                                    ? "text-destructive"
                                    : predictionResult.real_time_factors
                                        .festival.impact === "Medium"
                                    ? "text-amber-500"
                                    : "text-green-500"
                                }`}
                              >
                                {
                                  predictionResult.real_time_factors.festival
                                    .impact
                                }{" "}
                                Impact
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <Card className="bg-primary/5 border-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Summary & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Based on current conditions, delivering between{" "}
                        <span className="font-medium">
                          {predictionResult.optimal_times[0]}
                        </span>{" "}
                        would be optimal for this customer in{" "}
                        {predictionResult.customer_area}.
                        {predictionResult.real_time_factors.traffic
                          .congestion_level === "High" &&
                          " Consider allowing extra time due to high traffic congestion."}
                        {predictionResult.real_time_factors.weather.conditions
                          .toLowerCase()
                          .includes("rain") &&
                          " Weather conditions might slow down delivery speed; drive safely."}
                        {predictionResult.real_time_factors.festival &&
                          ` Plan routes to avoid areas affected by the ${predictionResult.real_time_factors.festival.name} event.`}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No Prediction Results Yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select a customer and optionally specify a day to get
                  predictions for the best delivery time based on real-time
                  factors like weather, traffic, and local events.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
