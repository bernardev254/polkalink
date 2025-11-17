import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PolkadotProvider, usePolkadot } from "@/contexts/PolkadotContext";
import Navbar from "@/components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import DataVerification from "./pages/DataVerification";
import Governance from "./pages/Governance";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { account } = usePolkadot();

  return (
    <div className="min-h-screen bg-background">
      {account ? (
        <>
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/data-verification" element={<DataVerification />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </>
      ) : (
        <Landing />
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PolkadotProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </PolkadotProvider>
  </QueryClientProvider>
);

export default App;
