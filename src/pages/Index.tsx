
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FilePlus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ArrowRight 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import RequestCard from '@/components/RequestCard';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { mockRequests } from '@/utils/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const PageContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
};

const SectionTitle: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
};

const Index: React.FC = () => {
  // Get recent requests for the dashboard
  const recentRequests = mockRequests.slice(0, 5);
  
  // Organize requests by status
  const pendingRequests = mockRequests.filter(req => 
    req.status === 'Solicitado' || req.status === 'Em Cotação'
  ).slice(0, 3);
  
  const approvedRequests = mockRequests.filter(req => 
    req.status === 'Aprovado' || req.status === 'Aprovado para Compra'
  ).slice(0, 3);
  
  const completedRequests = mockRequests.filter(req => 
    req.status === 'Finalizado'
  ).slice(0, 3);
  
  return (
    <PageContainer>
      <div className="section-padding">
        <SectionTitle 
          title="Dashboard"
          description="Visão geral do sistema de compras"
          action={
            <Link to="/request/new">
              <Button className="mt-4 sm:mt-0 w-full sm:w-auto">
                <FilePlus className="mr-2 h-4 w-4" />
                Nova Solicitação
              </Button>
            </Link>
          }
        />
        
        <DashboardStats />
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Solicitações Recentes</CardTitle>
                <Link to="/requests" className="text-sm text-primary flex items-center">
                  Ver todas
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <CardDescription>
                Últimas solicitações registradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentRequests.map((request, index) => (
                <div 
                  key={request.id}
                  className={`animate-slideInRight delay-${index * 100}`}
                >
                  <RequestCard request={request} />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="glass-card animate-slideInUp">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-500" />
                  Aguardando Aprovação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map(request => (
                    <Link 
                      key={request.id} 
                      to={`/requests/${request.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{request.application}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.requesterName} • CC: {request.costCenter}
                        </p>
                      </div>
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Não há solicitações pendentes
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Link to="/requests?status=pending" className="text-sm text-primary w-full text-center">
                  Ver todas pendentes
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="glass-card animate-slideInUp delay-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Em Processamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {approvedRequests.length > 0 ? (
                  approvedRequests.map(request => (
                    <Link 
                      key={request.id} 
                      to={`/requests/${request.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{request.application}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.requesterName} • CC: {request.costCenter}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Não há solicitações em processamento
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Link to="/requests?status=processing" className="text-sm text-primary w-full text-center">
                  Ver todas em processamento
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="glass-card animate-slideInUp delay-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Concluídas Recentemente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {completedRequests.length > 0 ? (
                  completedRequests.map(request => (
                    <Link 
                      key={request.id} 
                      to={`/requests/${request.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{request.application}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.requesterName} • CC: {request.costCenter}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Não há solicitações concluídas recentemente
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Link to="/requests?status=completed" className="text-sm text-primary w-full text-center">
                  Ver todas concluídas
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
