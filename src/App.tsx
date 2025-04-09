
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RequestForm from "./pages/RequestForm";
import RequestDetail from "./pages/RequestDetail";
import Requests from "./pages/Requests";
import Purchases from "./pages/Purchases";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import QuoteForm from "./pages/QuoteForm";
import QuoteDetail from "./pages/QuoteDetail";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

// Componente de proteção de rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar autenticação ao iniciar
    const checkAuth = async () => {
      // Simulação de verificação de token
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="dineng-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/request/new" element={
                <ProtectedRoute>
                  <Layout>
                    <RequestForm />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/requests" element={
                <ProtectedRoute>
                  <Layout>
                    <Requests />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/requests/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <RequestDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/purchases" element={
                <ProtectedRoute>
                  <Layout>
                    <Purchases />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/purchases/new" element={
                <ProtectedRoute>
                  <Layout>
                    <QuoteForm />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/purchases/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <QuoteDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/suppliers" element={
                <ProtectedRoute>
                  <Layout>
                    <Suppliers />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
