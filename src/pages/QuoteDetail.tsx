
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Check,
  Printer,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/StatusBadge';

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
  
  const [quote, setQuote] = useState<Quote>({
    id: Number(id),
    code: 'CC-3308',
    title: 'Reparo de moto',
    date: '2023-06-15',
    status: 'pending',
    totalValue: 550,
    items: [
      { itemId: 1, supplierId: 1, supplierName: 'Fornecedor A Ltda', itemName: 'Peça de Motor', quantity: 2, unitValue: 150, totalValue: 300, selected: true },
      { itemId: 2, supplierId: 1, supplierName: 'Fornecedor A Ltda', itemName: 'Filtro de Óleo', quantity: 1, unitValue: 45, totalValue: 45, selected: true },
      { itemId: 3, supplierId: 3, supplierName: 'Fornecedor C ME', itemName: 'Óleo Lubrificante', quantity: 3, unitValue: 25, totalValue: 75, selected: true },
      { itemId: 4, supplierId: 2, supplierName: 'Fornecedor B S.A.', itemName: 'Pastilha de Freio', quantity: 4, unitValue: 32.5, totalValue: 130, selected: true },
    ]
  });
  
  const handleBack = () => {
    navigate('/purchases');
  };
  
  const handlePrint = () => {
    toast.info('Imprimindo cotação...');
    // Implementação futura da função de impressão
  };
  
  const handleApprove = () => {
    setQuote({ ...quote, status: 'approved' });
    toast.success('Cotação aprovada com sucesso!');
  };
  
  const handleReject = () => {
    setQuote({ ...quote, status: 'rejected' });
    toast.error('Cotação rejeitada.');
  };
  
  const toggleItemSelection = (itemId: number) => {
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
    switch (quote.status) {
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      default:
        return 'Pendente';
    }
  };
  
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Cotação #{quote.code}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
                      {getStatusText()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Criada em {formatDate(quote.date)}
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
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={handleReject}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeitar
                    </Button>
                    <Button onClick={handleApprove}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card animate-fadeIn">
                  <CardHeader>
                    <CardTitle>{quote.title}</CardTitle>
                    <CardDescription>Detalhes da cotação</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Código</p>
                          <p className="font-medium">{quote.code}</p>
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
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Itens da Cotação</h3>
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
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="glass-card animate-fadeIn">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Status da Cotação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status atual</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
                          {getStatusText()}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-3">Etapas do Processo</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              quote.status !== 'pending' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {quote.status !== 'pending' 
                                ? <CheckCircle className="h-4 w-4" />
                                : <Clock className="h-4 w-4" />
                              }
                            </div>
                            <span className="text-sm">Criação</span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              quote.status === 'approved' || quote.status === 'rejected'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {quote.status === 'approved' || quote.status === 'rejected'
                                ? <CheckCircle className="h-4 w-4" />
                                : <Clock className="h-4 w-4" />
                              }
                            </div>
                            <span className="text-sm">Análise</span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              quote.status === 'approved'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {quote.status === 'approved'
                                ? <CheckCircle className="h-4 w-4" />
                                : <Clock className="h-4 w-4" />
                              }
                            </div>
                            <span className="text-sm">Aprovação</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card animate-fadeIn">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Resumo por Fornecedor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getSupplierSummary().map((supplier, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <h3 className="font-medium mb-1">{supplier.name}</h3>
                          <p className="text-sm">
                            Valor Total: <span className="font-semibold">
                              {supplier.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </p>
                        </div>
                      ))}
                      
                      <Separator className="my-2" />
                      
                      <div className="font-medium text-right">
                        Total Selecionado: {quote.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuoteDetail;
