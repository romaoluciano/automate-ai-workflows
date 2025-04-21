
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Diagnostico from "./pages/Diagnostico";
import Automacoes from "./pages/Automacoes";
import Marketplace from "./pages/Marketplace";
import Partners from "./pages/Partners";
import PartnerApplication from "./pages/PartnerApplication";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/diagnostico" element={<Diagnostico />} />
            <Route path="/automacoes" element={<Automacoes />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/parceiros" element={<Partners />} />
            <Route path="/partner-application" element={<PartnerApplication />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
