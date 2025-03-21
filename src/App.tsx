
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Reset sidebar hover state when the document is loaded
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-hover', '0');
  }, []);

  const handleMouseEnter = () => {
    setSidebarHovered(true);
    document.documentElement.style.setProperty('--sidebar-hover', '1');
  };

  const handleMouseLeave = () => {
    setSidebarHovered(false);
    document.documentElement.style.setProperty('--sidebar-hover', '0');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <div 
                className="group peer fixed left-0 top-0 h-full z-40 w-2"
                onMouseEnter={handleMouseEnter}
              />
              <AppSidebar 
                isHovered={sidebarHovered} 
                onMouseLeave={handleMouseLeave} 
              />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
