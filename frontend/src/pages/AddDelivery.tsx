import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddOrder } from "@/api/mutations";
import { AddOrderRequest } from "@/api/types";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

// Form schema for delivery creation
const addDeliverySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  delivery_day: z.string().min(1, { message: "Please select a delivery day" }),
  area: z.string().min(1, { message: "Please enter the delivery area" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  package_size: z.string().min(1, { message: "Please select a package size" }),
});

// Customer list from backend data
const customers = [
  {
    id: "1",
    name: "Aditya",
    area: "Satellite",
    address: "Near Jodhpur Cross Road, Satellite, Ahmedabad - 380015",
  },
  {
    id: "2",
    name: "Vivaan",
    area: "Bopal",
    address: "Near Bopal Cross Road, Bopal, Ahmedabad - 380058",
  },
  {
    id: "3",
    name: "Aarav",
    area: "Vastrapur",
    address: "Near Vastrapur Lake, Vastrapur, Ahmedabad - 380015",
  },
  {
    id: "4",
    name: "Meera",
    area: "Paldi",
    address: "Opposite Dharnidhar Derasar, Paldi, Ahmedabad - 380007",
  },
  {
    id: "5",
    name: "Diya",
    area: "Thaltej",
    address: "Near Thaltej Cross Road, S.G. Highway, Ahmedabad - 380054",
  },
];

export default function AddDelivery() {
  const [selectedUser, setSelectedUser] = useState("");
  const addOrderMutation = useAddOrder();

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof addDeliverySchema>>({
    resolver: zodResolver(addDeliverySchema),
    defaultValues: {
      name: "",
      delivery_day: "",
      area: "",
      address: "",
      package_size: "",
    },
  });

  // Fill form with selected user data
  const handleUserSelect = (userId: string) => {
    const user = customers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(userId);
      form.setValue("name", user.name);
      form.setValue("area", user.area);
      form.setValue("address", user.address);
    }
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof addDeliverySchema>) => {
    const deliveryRequest: AddOrderRequest = {
      name: data.name,
      delivery_day: data.delivery_day,
      area: data.area,
      address: data.address,
      package_size: data.package_size,
    };

    addOrderMutation.mutate(deliveryRequest, {
      onSuccess: (response) => {
        toast.success("Delivery order created successfully!", {
          description: `Order #${response.order_id} has been scheduled for ${data.delivery_day}.`,
        });
        form.reset();
        setSelectedUser("");
      },
      onError: (error) => {
        toast.error("Failed to create delivery order", {
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Delivery</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Delivery Order</CardTitle>
              <CardDescription>
                Enter the details for the new delivery order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter customer name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="delivery_day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Day</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select delivery day" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Monday">Monday</SelectItem>
                              <SelectItem value="Tuesday">Tuesday</SelectItem>
                              <SelectItem value="Wednesday">
                                Wednesday
                              </SelectItem>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Area</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter delivery area"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter full address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="package_size"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Package Size</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-1"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Small" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Small
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Medium" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Medium
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Large" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Large
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="urgency"
                      render={() => (
                        <FormItem className="space-y-3">
                          <FormLabel>Delivery Urgency</FormLabel>
                          <FormControl>
                            <RadioGroup
                              defaultValue="normal"
                              className="flex space-x-1"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="low" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Low
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="normal" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Normal
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="high" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  High
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="urgent" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Urgent
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            Select the urgency level for this delivery
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={addOrderMutation.isPending}>
                      {addOrderMutation.isPending
                        ? "Creating..."
                        : "Create Delivery Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Select Customer</CardTitle>
              <CardDescription>
                Choose from existing customers to auto-fill the form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {customers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
                      selectedUser === user.id
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.area}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.address}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
