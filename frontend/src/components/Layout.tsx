import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Route,
  Clock,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProfile } from "@/components/auth/UserProfile";
import PageTransition from "@/components/PageTransition";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, title, isActive, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )
    }
  >
    {icon}
    <span>{title}</span>
    {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
  </NavLink>
);

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Dashboard",
    },
    {
      to: "/add-delivery",
      icon: <PlusCircle className="h-5 w-5" />,
      title: "Add Delivery",
    },
    {
      to: "/optimize-route",
      icon: <Route className="h-5 w-5" />,
      title: "Optimize Route",
    },
    {
      to: "/delivery-prediction",
      icon: <Clock className="h-5 w-5" />,
      title: "Delivery Prediction",
    },
    {
      to: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Chat Assistant",
    },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <ThemeProvider defaultTheme="system" storageKey="optimized-delivery-theme">
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r h-screen fixed">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Route className="h-6 w-6 text-primary" />
              Optimized Delivery
            </h1>
          </div>

          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  title={item.title}
                  isActive={location.pathname === item.to}
                />
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t mt-auto">
            <UserProfile />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-40"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Route className="h-6 w-6 text-primary" />
                  Optimized Delivery
                </h1>
                <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4">
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      title={item.title}
                      isActive={location.pathname === item.to}
                      onClick={closeMobileMenu}
                    />
                  ))}
                </nav>
              </ScrollArea>

              <div className="p-4 border-t mt-auto">
                <UserProfile />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content with padding */}
        <main className="flex-1 lg:ml-64">
          <div className="lg:hidden h-16 border-b sticky top-0 bg-background z-30 flex items-center justify-center">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Route className="h-6 w-6 text-primary" />
              Optimized Delivery
            </h1>
          </div>
          <div className="p-4 lg:p-6">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
