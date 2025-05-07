import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

// Auth Provider
import { ClerkProvider } from "./components/auth/ClerkProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./lib/auth-context";
import { MotionProvider } from "./lib/motion-context";

// Auth Pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// Pages
import Dashboard from "./pages/Dashboard";
import AddDelivery from "./pages/AddDelivery";
import OptimizeRoute from "./pages/OptimizeRoute";
import DeliveryPrediction from "./pages/DeliveryPrediction";
import ChatAssistant from "./pages/ChatAssistant";
import NotFound from "./pages/NotFound";
import IndexPage from "./pages/index";

// Layout components
import Layout from "./components/Layout";

// Create a client
const queryClient = new QueryClient();

// AnimatedRoutes component to handle AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<IndexPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-delivery" element={<AddDelivery />} />
          <Route path="optimize-route" element={<OptimizeRoute />} />
          <Route path="delivery-prediction" element={<DeliveryPrediction />} />
          <Route path="chat" element={<ChatAssistant />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <AuthProvider>
          <MotionProvider>
            <Router>
              <Toaster position="top-right" />
              <AnimatedRoutes />
            </Router>
          </MotionProvider>
        </AuthProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default App;
