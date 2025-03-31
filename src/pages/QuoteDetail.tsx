
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Check,
  Printer,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { getQuoteById, updateQuote } from '@/api/quotes';

interface QuoteItem {
  itemId: number;
  supplierId: number;
  supplierName: string;
  itemName: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  selected: boolean;
}

interface Quote {
  id: number;
  code: string;
  title: string;
  date: string;
  items: QuoteItem[];
  status: 'pending' | 'approved' | 'rejected';
  totalValue: number;
}

const QuoteDetail = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { id } = useParams();
  const quoteId = Number(id);
  
  // Use React Query to fetch quote data
  const { data: quoteData, isLoading, error } = useQuery({
    queryKey: ['quote', quoteId],
    queryFn: () => getQuoteById(quoteId),
    enabled: !!quoteId && !isNaN(quoteId)
  });
  
  const [quote, setQuote] = useState<Quote | null>(null);
  
  // Update local state when query data changes
  React.useEffect(() => {
    if (quoteData) {
      setQuote(quoteData);
    }
  }, [quoteData]);
  
  const handleBack = () => {
    navigate('/cotacoes');
  };
  
  const handlePrint = () => {
    toast.info('Imprimindo cotação...');
    // Implementação futura da função de impressão
  };
  
  const handleApprove = async () => {
    if (!quote) return;
    
    try {
      await updateQuote(quote.id, 'approved');
      setQuote({ ...quote, status: 'approved' });
      toast.success('Cotação aprovada com sucesso!');
    } catch (error) {
      toast.error('Erro ao aprovar cotação');
      console.error(error);
    }
  };
  
  const handleReject = async () => {
    if (!quote) return;
    
    try {
      await updateQuote(quote.id, 'rejected');
      setQuote({ ...quote, status: 'rejected' });
      toast.error('Cotação rejeitada.');
    } catch (error) {
      toast.error('Erro ao rejeitar cotação');
      console.error(error);
    }
  };
  
  const toggleItemSelection = (itemId: number) => {
    if (!quote) return;
    
    setQuote({
      ...quote,
      items: quote.items.map(item => {
        if (item.itemId === itemId) {
          return { ...item, selected: !item.selected };
        }
        return item;
      }),
      totalValue: recalculateTotal(quote.items.map(item => {
        if (item.itemId === itemId) {
          return { ...item, selected: !item.selected };
        }
        return item;
      }))
    });
  };
  
  const recalculateTotal = (items: QuoteItem[]) => {
    return items
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.totalValue, 0);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getSupplierSummary = () => {
    if (!quote) return [];
    
    const supplierSummary: { [key: number]: { name: string, total: number } } = {};
    
    quote.items.forEach(item => {
      if (item.selected) {
        if (!supplierSummary[item.supplierId]) {
          supplierSummary[item.supplierId] = {
            name: item.supplierName,
            total: 0
          };
        }
        supplierSummary[item.supplierId].total += item.totalValue;
      }
    });
    
    return Object.values(supplierSummary);
  };
  
  const getBadgeColor = () => {
    if (!quote) return '';
    
    switch (quote.status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const getStatusText = () => {
    if (!quote) return '';
    
    switch (quote.status) {
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      default:
        return 'Pendente';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
          <div className="section-padding">
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando detalhes da cotação...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !quote) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
          <div className="section-padding">
            <div className="max-w-7xl mx-auto">
              <Button variant="ghost" size="icon" onClick={handleBack} className="mb-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <h2 className="text-xl font-bold mb-2">Cotação não encontrada</h2>
                    <p className="text-muted-foreground">
                      A cotação solicitada não existe ou não está disponível.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">Detalhes da Cotação</h2>
                  <p className="text-muted-foreground">
                    Visualize os detalhes da cotação
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                
                {quote.status === 'pending' && (
                  <>
                    <Button variant="destructive" onClick={handleReject}>
                      Rejeitar
                    </Button>
                    <Button onClick={handleApprove}>
                      <Check className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <Card className="glass-card animate-fadeIn mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Cotação {quote.code}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Título</p>
                      <p className="font-medium">{quote.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-medium">{formatDate(quote.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="font-medium">
                        {quote.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card animate-fadeIn mb-6">
              <CardHeader>
                <CardTitle>Comparativo de Fornecedores</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Selecionar</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead className="text-center">Valor Unitário</TableHead>
                      <TableHead className="text-center">Valor Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quote.items.map((item) => (
                      <TableRow key={item.itemId}>
                        <TableCell>
                          <Checkbox 
                            checked={item.selected}
                            onCheckedChange={() => toggleItemSelection(item.itemId)}
                          />
                        </TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.supplierName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-center">
                          {item.unitValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card className="glass-card animate-fadeIn mb-6">
              <CardHeader>
                <CardTitle>Resumo por Fornecedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getSupplierSummary().map((supplier, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">{supplier.name}</h3>
                      <p className="text-sm">
                        Valor Total: <span className="font-semibold">
                          {supplier.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuoteDetail;
