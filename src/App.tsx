
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import TransferForms from "./pages/TransferForms";
import Documents from "./pages/Documents";
import Templates from "./pages/Templates";
import ShipmentDetail from "./pages/ShipmentDetail";
import FormDetail from "./pages/FormDetail";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transfer-forms" element={<TransferForms />} />
            <Route path="transfer-forms/:id" element={<FormDetail />} />
            <Route path="documents" element={<Documents />} />
            <Route path="templates" element={<Templates />} />
            <Route path="shipments/:id" element={<ShipmentDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
