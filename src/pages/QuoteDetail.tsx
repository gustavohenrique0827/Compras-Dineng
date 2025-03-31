
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft,
  CheckSquare,
  DollarSign,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
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
  status: string;
  totalValue: number;
}

const QuoteDetail = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { id } = useParams();
  const quoteId = Number(id);
  
  const { data: quoteData, isLoading } = useQuery({
    queryKey: ['quote', quoteId],
    queryFn: () => getQuoteById(quoteId),
    enabled: !!quoteId && !isNaN(quoteId)
  });
  
  const [quote, setQuote] = useState<Quote | null>(null);
  
  useEffect(() => {
    if (quoteData) {
      setQuote(quoteData as Quote);
    }
  }, [quoteData]);
  
  const handleBack = () => {
    navigate('/cotacoes');
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
  
  const toggleItemSelection = (supplierId: number, itemId: number) => {
    if (!quote) return;
    
    setQuote({
      ...quote,
      items: quote.items.map(item => {
        if (item.itemId === itemId && item.supplierId === supplierId) {
          return { ...item, selected: !item.selected };
        }
        return item;
      }),
      totalValue: recalculateTotal(quote.items.map(item => {
        if (item.itemId === itemId && item.supplierId === supplierId) {
          return { ...item, selected: !item.selected };
        }
        return item;
      }))
    });
  };
  
  const toggleAllItems = (supplierId: number, select: boolean) => {
    if (!quote) return;
    
    setQuote({
      ...quote,
      items: quote.items.map(item => {
        if (item.supplierId === supplierId) {
          return { ...item, selected: select };
        }
        return item;
      }),
      totalValue: recalculateTotal(quote.items.map(item => {
        if (item.supplierId === supplierId) {
          return { ...item, selected: select };
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
  
  // Group items by supplier
  const getSupplierItems = () => {
    if (!quote) return {};
    
    const supplierGroups: Record<number, {name: string, items: QuoteItem[]}> = {};
    
    quote.items.forEach(item => {
      if (!supplierGroups[item.supplierId]) {
        supplierGroups[item.supplierId] = {
          name: item.supplierName,
          items: []
        };
      }
      supplierGroups[item.supplierId].items.push(item);
    });
    
    return supplierGroups;
  };
  
  // Calculate the total value for a supplier's selected items
  const getSupplierTotal = (supplierId: number) => {
    if (!quote) return 0;
    
    return quote.items
      .filter(item => item.supplierId === supplierId && item.selected)
      .reduce((sum, item) => sum + item.totalValue, 0);
  };
  
  if (isLoading || !quote) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
          <div className="section-padding">
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-2">Carregando detalhes da cotação...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  const supplierGroups = getSupplierItems();
  const supplierIds = Object.keys(supplierGroups).map(Number);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold">Aprovação de Cotação</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {supplierIds.map((supplierId, index) => {
                const supplier = supplierGroups[supplierId];
                const areAllSelected = supplier.items.every(item => item.selected);
                
                return (
                  <Card key={supplierId} className="border-2">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Fornecedor {index + 1}</CardTitle>
                        <div className="flex items-center gap-2 text-sm">
                          <span>Selecionar todos</span>
                          <Checkbox 
                            checked={areAllSelected}
                            onCheckedChange={(checked) => toggleAllItems(supplierId, !!checked)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-0 pt-0">
                      {supplier.items.map((item) => (
                        <div 
                          key={`${supplierId}-${item.itemId}`} 
                          className="flex justify-between items-center py-2 border-b bg-primary/10"
                        >
                          <span className="text-white font-medium pl-2">Item: {item.itemName}</span>
                          <Checkbox 
                            checked={item.selected}
                            onCheckedChange={() => toggleItemSelection(supplierId, item.itemId)}
                            className="mr-2"
                          />
                        </div>
                      ))}
                      
                      <div className="flex justify-center items-center py-4 mt-4 bg-primary text-white font-medium">
                        <DollarSign className="h-5 w-5 mr-1" />
                        Valor: {getSupplierTotal(supplierId).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <Button 
                variant="destructive" 
                onClick={handleReject}
                className="bg-orange-500 hover:bg-orange-600 px-8"
              >
                Negar
              </Button>
              <Button 
                onClick={handleApprove}
                className="bg-primary hover:bg-primary/90 px-8"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuoteDetail;
