import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CalendarIcon,
  CloudRainWind,
  MapPinIcon,
  TruckIcon,
  AlertTriangle,
} from "lucide-react";
import { mockPendingOrders, mockRealTimeData } from "@/lib/mockData";
import { Order, RealTimeDataResponse } from "@/api/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  MotionCard,
  MotionFade,
  MotionList,
  MotionItem,
} from "@/components/motion/MotionElements";

// Mock data for charts
const deliveryMonthlyData = [
  { name: "Jan", successful: 65, failed: 5 },
  { name: "Feb", successful: 59, failed: 7 },
  { name: "Mar", successful: 80, failed: 10 },
  { name: "Apr", successful: 81, failed: 8 },
  { name: "May", successful: 56, failed: 4 },
  { name: "Jun", successful: 55, failed: 6 },
];

const failureReasonData = [
  { name: "Wrong Address", value: 45 },
  { name: "Customer Not Available", value: 25 },
  { name: "Weather Conditions", value: 15 },
  { name: "Traffic Issues", value: 10 },
  { name: "Other", value: 5 },
];

// Chart color config for theme compatibility
const chartConfig = {
  successful: {
    label: "Successful Deliveries",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
  failed: {
    label: "Failed Deliveries",
    theme: {
      light: "hsl(var(--destructive))",
      dark: "hsl(var(--destructive))",
    },
  },
  pie0: {
    theme: { light: "hsl(217 91% 60%)", dark: "hsl(217 91% 60%)" },
  },
  pie1: {
    theme: { light: "hsl(172 67% 45%)", dark: "hsl(172 67% 45%)" },
  },
  pie2: {
    theme: { light: "hsl(40 96% 62%)", dark: "hsl(40 96% 62%)" },
  },
  pie3: {
    theme: { light: "hsl(17 80% 50%)", dark: "hsl(17 80% 50%)" },
  },
  pie4: {
    theme: { light: "hsl(262 60% 62%)", dark: "hsl(262 60% 62%)" },
  },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeDataResponse | null>(
    null
  );
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingRealTime, setIsLoadingRealTime] = useState(true);

  // Load mock data
  useEffect(() => {
    // Simulate API loading delay
    const ordersTimer = setTimeout(() => {
      setPendingOrders(mockPendingOrders);
      setIsLoadingOrders(false);
    }, 800);

    const realTimeTimer = setTimeout(() => {
      setRealTimeData(mockRealTimeData);
      setIsLoadingRealTime(false);
    }, 1200);

    return () => {
      clearTimeout(ordersTimer);
      clearTimeout(realTimeTimer);
    };
  }, []);

  // Filter today's orders
  const todayOrders = pendingOrders?.filter((order) => {
    const orderDate = new Date(order.created_at);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  return (
    <MotionFade className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery Dashboard</h1>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <MotionList className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Summary Cards */}
            <MotionItem>
              <MotionCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TruckIcon className="h-5 w-5 text-primary" />
                    Today's Deliveries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {todayOrders?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isLoadingOrders
                      ? "Loading..."
                      : "Deliveries scheduled for today"}
                  </p>
                </CardContent>
              </MotionCard>
            </MotionItem>

            <MotionItem>
              <MotionCard delay={0.1}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-primary" />
                    Pending Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {pendingOrders?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isLoadingOrders
                      ? "Loading..."
                      : "Total pending deliveries"}
                  </p>
                </CardContent>
              </MotionCard>
            </MotionItem>

            <MotionItem>
              <MotionCard delay={0.2}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Delivery Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoadingOrders ? "..." : "92%"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    On-time delivery rate (last 30 days)
                  </p>
                </CardContent>
              </MotionCard>
            </MotionItem>
          </MotionList>

          {/* Delivery Performance Chart */}
          <MotionFade delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance (Last 6 Months)</CardTitle>
                <CardDescription>
                  Monthly breakdown of successful vs failed deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={chartConfig} className="h-full">
                    <RechartsBarChart data={deliveryMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip
                        content={(props) => <ChartTooltipContent {...props} />}
                      />
                      <Legend />
                      <Bar
                        dataKey="successful"
                        name="Successful Deliveries"
                        fill="var(--color-successful)"
                      />
                      <Bar
                        dataKey="failed"
                        name="Failed Deliveries"
                        fill="var(--color-failed)"
                      />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </MotionFade>

          {/* Failure Reasons Pie Chart */}
          <MotionFade delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Failure Reasons</CardTitle>
                <CardDescription>
                  Breakdown of reasons for failed deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ChartContainer config={chartConfig} className="h-full">
                    <RechartsPieChart>
                      <Pie
                        data={failureReasonData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {failureReasonData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`var(--color-pie${index})`}
                          />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </MotionFade>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather Card */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRainWind className="h-5 w-5 text-primary" />
                  Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRealTime ? (
                  <p>Loading weather data...</p>
                ) : realTimeData?.weather ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">
                        {realTimeData.weather.conditions}
                      </span>
                      <span className="text-3xl font-bold">
                        {realTimeData.weather.temperature.current}°C
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          Temperature Range
                        </p>
                        <p className="font-medium">
                          {realTimeData.weather.temperature.min}°C -{" "}
                          {realTimeData.weather.temperature.max}°C
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Precipitation</p>
                        <p className="font-medium">
                          {realTimeData.weather.precipitation.chance}% chance of{" "}
                          {realTimeData.weather.precipitation.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wind</p>
                        <p className="font-medium">
                          {realTimeData.weather.wind.speed} km/h{" "}
                          {realTimeData.weather.wind.direction}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Weather Impact on Deliveries:
                      </p>
                      <p className="text-sm mt-1">
                        {realTimeData.weather_summary ||
                          "Current weather conditions are favorable for deliveries. No significant delays expected."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No weather data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Traffic Card */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-primary" />
                  Traffic Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRealTime ? (
                  <p>Loading traffic data...</p>
                ) : realTimeData?.traffic ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">Congestion Level</span>
                      <span
                        className={`text-xl font-bold ${
                          realTimeData.traffic.congestion_level === "High"
                            ? "text-destructive"
                            : realTimeData.traffic.congestion_level === "Medium"
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {realTimeData.traffic.congestion_level}
                      </span>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Status</p>
                      <p className="font-medium">
                        {realTimeData.traffic.status}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Traffic Impact on Deliveries:
                      </p>
                      <p className="text-sm mt-1">
                        {realTimeData.traffic_summary ||
                          "Current traffic conditions may cause mild delays in urban areas. Plan alternate routes where possible."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No traffic data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Festivals & Events Card */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Events & Festivals</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRealTime ? (
                  <p>Loading events data...</p>
                ) : (
                  <div>
                    {realTimeData?.festivals &&
                    realTimeData.festivals.length > 0 ? (
                      <div className="space-y-4">
                        {realTimeData.festivals.map((festival, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between border-b pb-3"
                          >
                            <div>
                              <p className="font-medium">{festival.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Impact:{" "}
                                <span
                                  className={`font-medium ${
                                    festival.impact === "High"
                                      ? "text-destructive"
                                      : festival.impact === "Medium"
                                      ? "text-warning"
                                      : "text-success"
                                  }`}
                                >
                                  {festival.impact}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center">
                              {festival.impact === "High" && (
                                <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                              )}
                              <span className="text-sm">
                                Plan for alternate routes and extra delivery
                                time
                              </span>
                            </div>
                          </div>
                        ))}
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">
                            Festival/Event Impact Summary:
                          </p>
                          <p className="text-sm mt-1">
                            {realTimeData.festival_summary ||
                              "Upcoming festivals may cause congestion in central areas. Consider rescheduling deliveries or planning alternate routes."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No upcoming events or festivals that would impact
                        deliveries
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hourly Delivery Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Delivery Distribution</CardTitle>
                <CardDescription>
                  Number of deliveries by hour of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={chartConfig} className="h-full">
                    <RechartsBarChart
                      data={[
                        { time: "8-9", deliveries: 12 },
                        { time: "9-10", deliveries: 19 },
                        { time: "10-11", deliveries: 15 },
                        { time: "11-12", deliveries: 13 },
                        { time: "12-1", deliveries: 8 },
                        { time: "1-2", deliveries: 10 },
                        { time: "2-3", deliveries: 17 },
                        { time: "3-4", deliveries: 20 },
                        { time: "4-5", deliveries: 18 },
                        { time: "5-6", deliveries: 14 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip
                        content={(props) => <ChartTooltipContent {...props} />}
                      />
                      <Legend />
                      <Bar
                        dataKey="deliveries"
                        name="Number of Deliveries"
                        fill="var(--color-successful)"
                      />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Area Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Deliveries by Area</CardTitle>
                <CardDescription>
                  Distribution of deliveries by area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={chartConfig} className="h-full">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: "Downtown", value: 35 },
                          { name: "Suburb North", value: 25 },
                          { name: "Suburb East", value: 20 },
                          { name: "Industrial Area", value: 15 },
                          { name: "Other Areas", value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {[0, 1, 2, 3, 4].map((index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`var(--color-pie${index})`}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={(props) => <ChartTooltipContent {...props} />}
                      />
                    </RechartsPieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MotionFade>
  );
}
