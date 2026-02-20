import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import AllotmentStatus from "./pages/AllotmentStatus";
import IPODetail from "./pages/IPODetail";
import Analytics from "./pages/Analytics";
import Market from "./pages/Market";
import PaperTrading from "./pages/PaperTrading";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/market" element={<Market />} />
            <Route path="/allotment" element={<AllotmentStatus />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ipo/:ipoId" element={<IPODetail />} />
            <Route path="/paper-trading" element={<PaperTrading />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
