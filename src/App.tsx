
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import Students from "./pages/Students";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/accountant" 
              element={
                <ProtectedRoute allowedRoles={['accountant']}>
                  <AccountantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                  <Students />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                  <Finance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/parent" 
              element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <ParentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
