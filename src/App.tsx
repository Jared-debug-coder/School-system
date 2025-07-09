import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Students from "./pages/Students";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle role-based redirection
const RoleBasedRedirect = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Show login form when no user is logged in
    return (
      <ProtectedRoute>
        <div>Not logged in</div>
      </ProtectedRoute>
    );
  }
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'accountant':
      return <Navigate to="/accountant" replace />;
    case 'teacher':
      return <Navigate to="/teacher" replace />;
    case 'parent':
      return <Navigate to="/parent" replace />;
    default:
      return <Navigate to="/admin" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={<RoleBasedRedirect />}
              />
              <Route 
                path="/admin" 
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
                path="/teacher" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard />
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
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;