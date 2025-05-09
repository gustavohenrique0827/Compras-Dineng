import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import QuoteComparison from '../QuoteComparison';
import { Printer, FileCheck, Download, Plus, Trash } from 'lucide-react';
import { QuoteItem, Supplier } from '@/api/quotes';

interface QuoteManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: number;
}

const fetchRequestItems = async (requestId: number) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/requests/${requestId}`);
    if (!response.ok) throw new Error('Falha ao carregar itens');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Erro ao buscar itens da solicitação:', error);
    return [];
  }
};

const fetchSuppliers = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/suppliers`);
    if (!response.ok) throw new Error('Falha ao carregar fornecedores');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return [];
  }
};

const QuoteManagementDialog: React.FC<QuoteManagementDialogProps> = ({ 
  open, 
  onOpenChange, 
  requestId 
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentSupplier, setCurrentSupplier] = useState<number | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  
  // Fetching request items
  const { data: requestItems = [] } = useQuery({
    queryKey: ['requestItems', requestId],
    queryFn: () => fetchRequestItems(requestId),
    enabled: open && requestId > 0
  });
  
  // Fetching suppliers
  const { data: availableSuppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
    enabled: open
  });
  
  // Handle adding a new supplier to the quote
  const handleAddSupplier = () => {
    if (!currentSupplier) {
      toast.error('Selecione um fornecedor');
      return;
    }
    
    const supplierExists = suppliers.some(s => s.id === currentSupplier);
    if (supplierExists) {
      toast.error('Este fornecedor já foi adicionado');
      return;
    }
    
    const supplier = availableSuppliers.find((s: any) => s.id === currentSupplier);
    if (!supplier) {
      toast.error('Fornecedor não encontrado');
      return;
    }
    
    // Create empty items for each request item
    const items = requestItems.map((item: any, index: number) => ({
      id: Date.now() + index,
      itemName: item.descricao,
      quantity: item.quantidade,
      price: 0,
      supplierId: currentSupplier,
      parcela: "" // Add the required parcela field with default empty string
    }));
    
    setSuppliers([...suppliers, {
      id: currentSupplier,
      name: supplier.nome,
      items
    }]);
    
    toast.success(`Fornecedor ${supplier.nome} adicionado`);
    setCurrentSupplier(null);
  };
  
  // Handle removing a supplier
  const handleRemoveSupplier = (supplierId: number) => {
    setSuppliers(suppliers.filter(s => s.id !== supplierId));
    toast.success('Fornecedor removido');
  };
  
  // Handle updating an item price
  const handleUpdateItemPrice = (supplierId: number, itemId: number, price: number) => {
    setSuppliers(prev => prev.map(supplier => {
      if (supplier.id === supplierId) {
        return {
          ...supplier,
          items: supplier.items.map(item => {
            if (item.id === itemId) {
              return { ...item, price };
            }
            return item;
          })
        };
      }
      return supplier;
    }));
  };
  
  // Handle quote submit
  const handleSubmitQuote = () => {
    // Validate that all items have prices
    let isValid = true;
    suppliers.forEach(supplier => {
      supplier.items.forEach(item => {
        if (item.price <= 0) {
          isValid = false;
        }
      });
    });
    
    if (!isValid) {
      toast.error('Todos os itens devem ter preços válidos');
      return;
    }
    
    // Submit and switch to compare tab
    toast.success('Cotações adicionadas com sucesso');
    setActiveTab('compare');
  };
  
  // Handle quote finalization
  const handleFinishQuote = (selectedItems: QuoteItem[]) => {
    toast.success('Cotação finalizada com sucesso');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Gerenciamento de Cotações</DialogTitle>
          <DialogDescription>
            Adicione fornecedores e informe os preços para cada item da solicitação
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="create">Criar Cotação</TabsTrigger>
            <TabsTrigger value="compare" disabled={suppliers.length < 1}>
              Comparar Cotações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 mt-2">
            <div className="flex space-x-2 items-end">
              <div className="flex-1">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Select 
                  value={currentSupplier?.toString() || ''} 
                  onValueChange={val => setCurrentSupplier(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSuppliers.map((supplier: any) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddSupplier}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Fornecedor
              </Button>
            </div>
            
            {suppliers.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Nenhum fornecedor adicionado. Adicione fornecedores para iniciar a cotação.
                  </p>
                </CardContent>
              </Card>
            ) : (
              suppliers.map(supplier => (
                <Card key={supplier.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/20 py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">
                        {supplier.name}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive h-8"
                        onClick={() => handleRemoveSupplier(supplier.id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-muted-foreground">
                          <th className="text-left pb-2">Item</th>
                          <th className="text-center pb-2">Quantidade</th>
                          <th className="text-right pb-2">Preço Unitário</th>
                          <th className="text-right pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplier.items.map(item => (
                          <tr key={item.id} className="border-t">
                            <td className="py-2 text-sm">{item.itemName}</td>
                            <td className="py-2 text-center text-sm">{item.quantity}</td>
                            <td className="py-2">
                              <div className="flex items-center justify-end">
                                <span className="mr-1">R$</span>
                                <Input 
                                  type="number" 
                                  min={0} 
                                  step={0.01}
                                  value={item.price || ''}
                                  onChange={(e) => handleUpdateItemPrice(
                                    supplier.id, 
                                    item.id, 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="w-24 text-right"
                                />
                              </div>
                            </td>
                            <td className="py-2 text-right text-sm">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t">
                          <td colSpan={3} className="py-2 text-right font-medium">
                            Total:
                          </td>
                          <td className="py-2 text-right font-medium">
                            R$ {supplier.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                disabled={suppliers.length === 0} 
                onClick={handleSubmitQuote}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Salvar Cotações
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="compare" className="space-y-4 mt-2">
            <div className="flex justify-end space-x-2 mb-4">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
            
            <QuoteComparison 
              suppliers={suppliers}
              onFinish={handleFinishQuote}
              onCancel={() => setActiveTab('create')}
              requestId={requestId}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteManagementDialog;
