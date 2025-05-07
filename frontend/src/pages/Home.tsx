import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Home = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            Welcome to Optimized Delivery
          </CardTitle>
          <CardDescription>
            Manage and optimize your delivery operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your delivery dashboard content will appear here.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Stats {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Delivery statistics will appear here.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
