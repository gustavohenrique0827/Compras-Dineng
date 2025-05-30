import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Clock,
  FileText,
  MapPin,
  Calendar,
  Tag,
  AlertTriangle,
  CircleDollarSign,
  Clipboard,
  PackageCheck,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileEdit,
  Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import ItemTable from '@/components/ItemTable';
import ApprovalFlow from '@/components/ApprovalFlow';
import QuoteComparison from '@/components/QuoteComparison';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchRequestById, updateStatus } from '@/api/requests';
import { createNewQuote, updateQuote, Supplier, QuoteItem } from '@/api/quotes';
import { useIsMobile } from '@/hooks/use-mobile';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getDaysRemaining = (dateString: string) => {
  if (!dateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('details');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [editData, setEditData] = useState({
    aplicacao: '',
    motivo: '',
    prioridade: '',
    prazo_entrega: '',
    local_entrega: ''
  });
  
  const supplierQuotes: Supplier[] = [
    {
      id: 1,
      name: "1",
      items: [
        { id: 1, itemName: "Peça de reposição", quantity: 1, price: 120.00, supplierId: 1, parcela: "" },
        { id: 2, itemName: "Ferramenta", quantity: 1, price: 80.00, supplierId: 1, parcela: "" },
        { id: 3, itemName: "Material consumível", quantity: 1, price: 30.00, supplierId: 1, parcela: "" }
      ]
    },
    {
      id: 2,
      name: "2",
      items: [
        { id: 4, itemName: "Peça de reposição", quantity: 1, price: 135.00, supplierId: 2, parcela: "" },
        { id: 5, itemName: "Ferramenta", quantity: 1, price: 75.00, supplierId: 2, parcela: "" },
        { id: 6, itemName: "Material consumível", quantity: 1, price: 25.00, supplierId: 2, parcela: "" }
      ]
    },
    {
      id: 3,
      name: "3",
      items: [
        { id: 7, itemName: "Peça de reposição", quantity: 1, price: 110.00, supplierId: 3, parcela: "" },
        { id: 8, itemName: "Ferramenta", quantity: 1, price: 95.00, supplierId: 3, parcela: "" },
        { id: 9, itemName: "Material consumível", quantity: 1, price: 35.00, supplierId: 3, parcela: "" }
      ]
    }
  ];
  
  const { data: request, isLoading, error, refetch } = useQuery({
    queryKey: ['request', id],
    queryFn: () => fetchRequestById(Number(id)),
    enabled: !!id,
    retry: 1
  });
  
  const approveMutation = useMutation({
    mutationFn: () => updateStatus(Number(id), 'Aprovado', {
      etapa: 'Solicitação',
      status: 'Aprovado',
      aprovado_por: 'Usuário Atual', // In a real app, get from auth context
      nivel_aprovacao: 'Supervisão'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      toast.success("Solicitação aprovada com sucesso!");
      refetch();
    },
    onError: (error) => {
      console.error('Error approving request:', error);
      toast.error("Erro ao aprovar solicitação. Tente novamente.");
    }
  });
  
  const rejectMutation = useMutation({
    mutationFn: () => updateStatus(Number(id), 'Rejeitado', {
      etapa: 'Solicitação',
      status: 'Rejeitado',
      aprovado_por: 'Usuário Atual', // In a real app, get from auth context
      nivel_aprovacao: 'Supervisão',
      motivo_rejeicao: 'Rejeitado pelo aprovador.'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      toast.success("Solicitação rejeitada com sucesso!");
      refetch();
    },
    onError: (error) => {
      console.error('Error rejecting request:', error);
      toast.error("Erro ao rejeitar solicitação. Tente novamente.");
    }
  });
  
  const handleApproveRequest = () => {
    approveMutation.mutate();
  };
  
  const handleRejectRequest = () => {
    rejectMutation.mutate();
  };

  const handleManageQuotes = () => {
    setShowQuoteDialog(true);
  };

  const handleFinalizePurchase = () => {
    updateStatus(Number(id), "Finalizado")
      .then(() => {
        toast.success("Aquisição finalizada com sucesso");
        queryClient.invalidateQueries({ queryKey: ['request', id] });
        refetch();
      })
      .catch(error => {
        console.error('Error finalizing purchase:', error);
        toast.error("Erro ao finalizar aquisição");
      });
  };

  const handleEditRequest = () => {
    if (request) {
      setEditData({
        aplicacao: request.aplicacao || '',
        motivo: request.motivo || '',
        prioridade: request.prioridade || '',
        prazo_entrega: request.prazo_entrega || '',
        local_entrega: request.local_entrega || ''
      });
      setShowEditDialog(true);
    }
  };

  const handlePrintRequest = () => {
    toast.success("Imprimindo solicitação...");
    // In a real application, this would generate a PDF or open a print dialog
  };

  const handleViewHistory = () => {
    toast.info("Visualizando histórico de alterações");
    // In a real application, this would show a history log
  };

  const handleSaveEdit = () => {
    const updateData = {
      aplicacao: editData.aplicacao,
      motivo: editData.motivo,
      prioridade: editData.prioridade,
      prazo_entrega: editData.prazo_entrega,
      local_entrega: editData.local_entrega
    };
    
    fetch(`http://localhost:5000/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao atualizar solicitação');
      return response.json();
    })
    .then(() => {
      toast.success("Solicitação atualizada com sucesso");
      setShowEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      refetch();
    })
    .catch(error => {
      console.error('Error updating request:', error);
      toast.error("Erro ao atualizar solicitação");
    });
  };

  const handleSaveQuote = (selectedItems: any[]) => {
    const quoteData = {
      requestId: Number(id),
      items: selectedItems,
      status: 'Em Cotação'
    };
    
    createNewQuote(quoteData)
      .then(() => {
        toast.success("Cotação finalizada com sucesso");
        setShowQuoteDialog(false);
        
        return updateStatus(Number(id), "Em Cotação");
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['request', id] });
        refetch();
      })
      .catch(error => {
        console.error('Error creating quote:', error);
        toast.error("Erro ao criar cotação");
      });
  };
  
  const handleCancelQuote = () => {
    setShowQuoteDialog(false);
    toast.info("Operação cancelada");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className={`pb-20-1 ${isMobile ? 'pt-20-1' : 'ml-64-1'}`}>
          <div className="section-padding">
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando detalhes da solicitação...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !request) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className={`pb-20-1 ${isMobile ? 'pt-20-1' : 'ml-64-1'}`}>
          <div className="section-padding">
            <div className="max-w-4xl mx-auto text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Solicitação não encontrada</h2>
              <p className="text-muted-foreground mb-6">
                A solicitação que você está procurando não existe ou foi removida.
              </p>
              <Button onClick={() => navigate('/requests')}>
                Ver todas as solicitações
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  const daysRemaining = request.prazo_entrega ? getDaysRemaining(request.prazo_entrega) : 0;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20-1 ${isMobile ? 'pt-20-1' : 'ml-64-1'}`}>
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="mr-2"
                  onClick={() => navigate('/requests')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Solicitação #{request?.id}</h2>
                    <StatusBadge type="status" value={request?.status || 'Desconhecido'} />
                  </div>
                  <p className="text-muted-foreground">
                    Criada em {request && formatDate(request.data_solicitacao || '')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {request?.status === 'Solicitado' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      disabled={rejectMutation.isPending || approveMutation.isPending}
                      onClick={handleRejectRequest}
                    >
                      {rejectMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Rejeitar
                    </Button>
                    <Button
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      onClick={handleApproveRequest}
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Aprovar
                    </Button>
                  </>
                )}
                
                {['Aprovado', 'Em Cotação'].includes(request?.status || '') && (
                  <Button onClick={handleManageQuotes}>
                    <CircleDollarSign className="mr-2 h-4 w-4" />
                    Gerenciar Cotações
                  </Button>
                )}
                
                {request?.status === 'Aprovado para Compra' && (
                  <Button onClick={handleFinalizePurchase}>
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Finalizar Aquisição
                  </Button>
                )}
                
                {!['Finalizado', 'Rejeitado'].includes(request?.status || '') && (
                  <Button variant="outline" onClick={handleEditRequest}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card animate-fadeIn">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <CardHeader>
                      <CardTitle>{request.aplicacao}</CardTitle>
                      <CardDescription>{request.motivo}</CardDescription>
                      <TabsList className="mt-2">
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        <TabsTrigger value="items">Itens</TabsTrigger>
                        {request.quotes && request.quotes.length > 0 && (
                          <TabsTrigger value="quotes">Cotações</TabsTrigger>
                        )}
                      </TabsList>
                    </CardHeader>
                    
                    <TabsContent value="details" className="m-0">
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Solicitante
                              </h4>
                              <p className="font-medium">{request.nome_solicitante}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Centro de Custo
                              </h4>
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p className="font-medium">{request.centro_custo}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Local de Entrega
                              </h4>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p className="font-medium">{request.local_entrega}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Categoria
                              </h4>
                              <div className="flex items-center">
                                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                <StatusBadge type="category" value={request.categoria} />
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Prioridade
                              </h4>
                              <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                                <StatusBadge type="priority" value={request.prioridade} />
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Prazo de Entrega
                              </h4>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p className="font-medium">{formatDate(request.prazo_entrega)}</p>
                                <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                                  daysRemaining < 0 ? 'bg-red-100 text-red-700' : 
                                  daysRemaining <= 2 ? 'bg-amber-100 text-amber-700' : 
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {daysRemaining < 0 
                                    ? `${Math.abs(daysRemaining)} dias em atraso` 
                                    : daysRemaining === 0 
                                      ? 'Hoje'
                                      : `${daysRemaining} dias restantes`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Motivo da Compra
                          </h4>
                          <p className="text-sm whitespace-pre-line">{request.motivo}</p>
                        </div>
                      </CardContent>
                    </TabsContent>
                    
                    <TabsContent value="items" className="m-0">
                      <CardContent>
                        <ItemTable items={request.items || []} />
                      </CardContent>
                    </TabsContent>
                    
                    {request.quotes && request.quotes.length > 0 && (
                      <TabsContent value="quotes" className="m-0">
                        <CardContent>
                          <div className="space-y-6">
                            {request.quotes.map((quote: any) => (
                              <div 
                                key={quote.id}
                                className="border rounded-lg p-4 transition-all hover:border-primary/30"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                  <div>
                                    <h4 className="font-medium">{quote.fornecedor}</h4>
                                    <p className="text-muted-foreground text-sm">
                                      Entrega: {formatDate(quote.prazo_entrega)}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <div className="text-lg font-bold">
                                      {formatCurrency(quote.preco)}
                                    </div>
                                    <StatusBadge 
                                      type="status" 
                                      value={quote.status} 
                                      className={quote.status === 'Aprovado' ? 'bg-green-100 text-green-800' : ''}
                                    />
                                  </div>
                                </div>
                                
                                <div className="mt-3 pt-3 border-t">
                                  <h5 className="text-sm font-medium text-muted-foreground mb-1">
                                    Condições
                                  </h5>
                                  <p className="text-sm">{quote.condicoes}</p>
                                </div>
                                
                                {quote.aprovado_por && (
                                  <div className="mt-3 pt-3 border-t text-sm">
                                    <span className="text-muted-foreground">Aprovado por: </span>
                                    <span className="font-medium">{quote.aprovado_por}</span>
                                    <span className="text-muted-foreground ml-1">({quote.nivel_aprovacao})</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </TabsContent>
                    )}
                  </Tabs>
                </Card>
                
                {request.approvals && request.approvals.length > 0 && (
                  <Card className="glass-card animate-fadeIn delay-100">
                    <CardHeader>
                      <CardTitle>Histórico de Aprovações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ApprovalFlow request={request} />
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="space-y-6">
                <Card className="glass-card animate-fadeIn">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Status da Solicitação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status atual</span>
                        <StatusBadge type="status" value={request.status} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prioridade</span>
                        <StatusBadge type="priority" value={request.prioridade} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prazo restante</span>
                        <span className={`text-sm font-medium ${
                          daysRemaining < 0 ? 'text-red-600' : 
                          daysRemaining <= 2 ? 'text-amber-600' : 
                          'text-green-600'
                        }`}>
                          {daysRemaining < 0 
                            ? `${Math.abs(daysRemaining)} dias em atraso` 
                            : daysRemaining === 0 
                              ? 'Vence hoje'
                              : `${daysRemaining} dias`}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-3">Etapas do Processo</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              ['Aprovado', 'Em Cotação', 'Aprovado para Compra', 'Aquisitado', 'Finalizado'].includes(request.status) 
                                ? 'bg-green-100 text-green-600' 
                                : request.status === 'Rejeitado' 
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-blue-100 text-blue-600'
                            }`}>
                              {['Aprovado', 'Em Cotação', 'Aprovado para Compra', 'Aquisitado', 'Finalizado'].includes(request.status) 
                                ? <CheckCircle className="h-4 w-4" />
                                : request.status === 'Rejeitado'
                                  ? <XCircle className="h-4 w-4" />
                                  : <Clock className="h-4 w-4" />
                              }
                            </div>
                            <span className="text-sm">Solicitação</span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              ['Em Cotação', 'Aprovado para Compra', 'Aquisitado', 'Finalizado'].includes(request.status)
                                ? 'bg-green-100 text-green-600'
                                : request.status === 'Aprovado'
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'bg-gray-100 text-gray-400'
                            }`}>
                              {['Em Cotação', 'Aprovado para Compra', 'Aquisitado', 'Finalizado'].includes(request.status)
                                ? <CheckCircle className="h-4 w-4" />
                                : request.status === 'Aprovado'
                                  ? <RefreshCw className="h-4 w-4" />
                                  : <Clock className="h-4 w-4" />
                              }
                            </div>
                            <span className="text-sm">Cotação</span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              ['Aprovado para Compra', 'Aquisitado', 'Finalizado'].includes(request.status)
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {['Aprovado para Compra', 'Aquisitado', 'Finalizado'].includes(request.status)
                                ? <CheckCircle className="h-4 w-4" />
                                : <Clock className="h-4 w-4" />
                              }
                            </div>
                            <span className="text-sm">Aprovação da Cotação</span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              ['Aquisitado', 'Finalizado'].includes(request.status)
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {['Aquisitado', 'Finalizado'].includes(request.status)
                                ? <CheckCircle className="h-4 w-4" />
                                : <Clock className="h-4 w-4" />
                              }
                            </div>
                            <span className="text-sm">Aquisição</span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              request.status === 'Finalizado'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {request.status === 'Finalizado'
                                ? <CheckCircle className="h-4 w-4" />
                                : <Clock className="h-4 w-4" />
                              }
                            </div>
                            <span className="text-sm">Finalização</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card animate-fadeIn delay-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Ações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleViewHistory}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Ver histórico de alterações
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handlePrintRequest}
                    >
                      <Clipboard className="mr-2 h-4 w-4" />
                      Imprimir solicitação
                    </Button>
                    
                    {!['Finalizado', 'Rejeitado'].includes(request.status) && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleEditRequest}
                      >
                        <FileEdit className="mr-2 h-4 w-4" />
                        Editar solicitação
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Solicitação</DialogTitle>
            <DialogDescription>
              Atualize os dados da solicitação #{request.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Aplicação</label>
              <Input 
                value={editData.aplicacao} 
                onChange={(e) => setEditData({...editData, aplicacao: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo</label>
              <textarea 
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editData.motivo}
                onChange={(e) => setEditData({...editData, motivo: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridade</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editData.prioridade}
                onChange={(e) => setEditData({...editData, prioridade: e.target.value})}
              >
                <option value="Básica">Básica</option>
                <option value="Moderada">Moderada</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Prazo de Entrega</label>
              <Input 
                type="date"
                value={editData.prazo_entrega}
                onChange={(e) => setEditData({...editData, prazo_entrega: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Local de Entrega</label>
              <Input 
                value={editData.local_entrega}
                onChange={(e) => setEditData({...editData, local_entrega: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Cotações</DialogTitle>
            <DialogDescription>
              Compare e selecione as melhores ofertas para a solicitação #{request?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <QuoteComparison 
              suppliers={supplierQuotes}
              onFinish={handleSaveQuote}
              onCancel={handleCancelQuote}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestDetail;
