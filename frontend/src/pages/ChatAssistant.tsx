import { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/api/mutations";
import { usePendingOrders } from "@/api/queries";
import { Order } from "@/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SendIcon,
  BotIcon,
  UserIcon,
  PackageIcon,
  MapPinIcon,
  Loader2Icon,
} from "lucide-react";

type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatAssistant() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your delivery assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: pendingOrders, isLoading: isLoadingOrders } =
    usePendingOrders();
  const chatMutation = useChatbot();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message submission
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Send message to chatbot API
    chatMutation.mutate(
      { message: inputValue },
      {
        onSuccess: (response) => {
          // Add bot response
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: response.response,
            sender: "bot",
            timestamp: new Date(),
          };
          setIsTyping(false);
          setMessages((prev) => [...prev, botMessage]);
        },
        onError: (error) => {
          // Add error message
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
            sender: "bot",
            timestamp: new Date(),
          };
          setIsTyping(false);
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 md:py-8 max-w-[1600px] overflow-hidden">
      <h1 className="text-3xl font-bold mb-4 md:mb-6">Delivery Assistant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        <div className="lg:col-span-3">
          <Card className="h-[75vh] sm:h-[80vh] md:h-[calc(100vh-180px)] flex flex-col overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BotIcon className="h-5 w-5 text-primary" />
                Chat with AI Assistant
              </CardTitle>
              <CardDescription>
                Ask about deliveries, optimal routes, or get help with order
                management
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6 h-[calc(100%-72px)]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.sender === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          {message.sender === "user" ? (
                            <>
                              <AvatarImage src="/avatar.png" />
                              <AvatarFallback>
                                <UserIcon className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/bot-avatar.png" />
                              <AvatarFallback>
                                <BotIcon className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 break-words ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback>
                            <BotIcon className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-muted break-words">
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full bg-current animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-current animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-current animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                    disabled={isTyping || chatMutation.isPending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={
                      isTyping || chatMutation.isPending || !inputValue.trim()
                    }
                  >
                    {isTyping || chatMutation.isPending ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendIcon className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-[75vh] sm:h-[80vh] md:h-[calc(100vh-180px)] flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PackageIcon className="h-4 w-4 text-primary" />
                Pending Orders
              </CardTitle>
              <CardDescription>
                Quick access to orders awaiting delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-[calc(100%-80px)]">
                <div className="p-4">
                  {isLoadingOrders ? (
                    <div className="py-8 text-center">
                      <Loader2Icon className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading orders...
                      </p>
                    </div>
                  ) : pendingOrders && pendingOrders.length > 0 ? (
                    <div className="space-y-2">
                      {pendingOrders.map((order: Order) => (
                        <div
                          key={order.order_id}
                          className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 mr-2">
                              <p className="font-medium truncate">
                                {order.name}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{order.area}</span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                order.status === "Pending"
                                  ? "outline"
                                  : order.status === "Processing"
                                  ? "secondary"
                                  : "default"
                              }
                              className="text-[10px] whitespace-nowrap flex-shrink-0"
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-xs">
                            <span className="text-muted-foreground truncate">
                              #{order.order_id}
                            </span>
                            <span className="font-medium ml-2 flex-shrink-0">
                              {order.delivery_day}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No pending orders
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
