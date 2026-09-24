import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import GoalLevelDetail from "./pages/GoalLevelDetail";
import GoalDetail from "./pages/GoalDetail";
import PhaseOrder from "./pages/PhaseOrder";
import A1Goals from "./pages/A1Goals";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/doel/:goalId" element={<GoalDetail />} />
            <Route path="/doel/:goalId/:level" element={<GoalLevelDetail />} />
            <Route path="/volgorde" element={<PhaseOrder />} />
            <Route path="/a1-doelen" element={<A1Goals />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
