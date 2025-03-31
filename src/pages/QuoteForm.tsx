
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { 
  ChevronDown, 
  Plus, 
  X,
  Check,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';

interface SupplierQuote {
  supplierId: number;
  supplierName: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
    selected: boolean;
  }[];
}

const QuoteForm = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [quoteTitle, setQuoteTitle] = useState('Reparo de moto');
  const [quoteCode, setQuoteCode] = useState('CC-3308');
  const [supplierQuotes, setSupplierQuotes] = useState<SupplierQuote[]>([
    {
      supplierId: 1,
      supplierName: 'Fornecedor A Ltda',
      items: [
        { id: 1, name: 'Peça de Motor', quantity: 2, unitValue: 150.00, totalValue: 300.00, selected: false },
        { id: 2, name: 'Filtro de Óleo', quantity: 1, unitValue: 45.00, totalValue: 45.00, selected: false },
        { id: 3, name: 'Óleo Lubrificante', quantity: 3, unitValue: 30.00, totalValue: 90.00, selected: false },
        { id: 4, name: 'Pastilha de Freio', quantity: 4, unitValue: 25.00, totalValue: 100.00, selected: false },
      ]
    }
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 1, nome: 'Fornecedor A Ltda', cnpj: '12.345.678/0001-90' },
    { id: 2, nome: 'Fornecedor B S.A.', cnpj: '23.456.789/0001-01' },
    { id: 3, nome: 'Fornecedor C ME', cnpj: '34.567.890/0001-12' },
    { id: 4, nome: 'Fornecedor D EPP', cnpj: '45.678.901/0001-23' },
  ]);

  const addSupplier = (supplierId: number) => {
    const selectedSupplier = suppliers.find(s => s.id === supplierId);
    if (!selectedSupplier) return;

    if (supplierQuotes.some(sq => sq.supplierId === supplierId)) {
      toast.error('Este fornecedor já foi adicionado à cotação.');
      return;
    }

    const newSupplierQuote: SupplierQuote = {
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.nome,
      items: [
        { id: 1, name: 'Peça de Motor', quantity: 2, unitValue: 0, totalValue: 0, selected: false },
        { id: 2, name: 'Filtro de Óleo', quantity: 1, unitValue: 0, totalValue: 0, selected: false },
        { id: 3, name: 'Óleo Lubrificante', quantity: 3, unitValue: 0, totalValue: 0, selected: false },
        { id: 4, name: 'Pastilha de Freio', quantity: 4, unitValue: 0, totalValue: 0, selected: false },
      ]
    };

    setSupplierQuotes([...supplierQuotes, newSupplierQuote]);
    toast.success(`Fornecedor ${selectedSupplier.nome} adicionado à cotação.`);
  };

  const removeSupplier = (supplierId: number) => {
    setSupplierQuotes(supplierQuotes.filter(sq => sq.supplierId !== supplierId));
    toast.info('Fornecedor removido da cotação.');
  };

  const updateItemUnitValue = (supplierId: number, itemId: number, value: number) => {
    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        return {
          ...sq,
          items: sq.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                unitValue: value,
                totalValue: value * item.quantity
              };
            }
            return item;
          })
        };
      }
      return sq;
    }));
  };

  const toggleItemSelection = (supplierId: number, itemId: number) => {
    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        return {
          ...sq,
          items: sq.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                selected: !item.selected
              };
            }
            return item;
          })
        };
      }
      return sq;
    }));
  };

  const toggleSelectAll = (supplierId: number, selected: boolean) => {
    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        return {
          ...sq,
          items: sq.items.map(item => ({
            ...item,
            selected
          }))
        };
      }
      return sq;
    }));
  };

  const getTotalValue = () => {
    let total = 0;
    supplierQuotes.forEach(sq => {
      sq.items.forEach(item => {
        if (item.selected) {
          total += item.totalValue;
        }
      });
    });
    return total;
  };

  const handleSaveQuote = () => {
    const selectedItems = supplierQuotes.flatMap(sq => 
      sq.items
        .filter(item => item.selected)
        .map(item => ({
          itemId: item.id,
          supplierName: sq.supplierName,
          supplierId: sq.supplierId,
          itemName: item.name,
          quantity: item.quantity,
          unitValue: item.unitValue,
          totalValue: item.totalValue
        }))
    );

    if (selectedItems.length === 0) {
      toast.error('Selecione pelo menos um item para salvar a cotação.');
      return;
    }

    const quote = {
      code: quoteCode,
      title: quoteTitle,
      date: new Date().toISOString(),
      items: selectedItems,
      totalValue: getTotalValue()
    };

    console.log('Cotação salva:', quote);
    toast.success('Cotação salva com sucesso!');
    
    // Navegar de volta para a página de cotações
    setTimeout(() => {
      navigate('/purchases');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Nova Cotação</h2>
              <p className="text-muted-foreground">
                Crie uma nova cotação para solicitação de compra
              </p>
            </div>
            
            <Card className="glass-card animate-fadeIn mb-6">
              <CardHeader>
                <CardTitle>Informações da Cotação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Código</label>
                    <Input 
                      value={quoteCode} 
                      onChange={(e) => setQuoteCode(e.target.value)} 
                      placeholder="Código da cotação" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <Input 
                      value={quoteTitle} 
                      onChange={(e) => setQuoteTitle(e.target.value)} 
                      placeholder="Título da cotação" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {supplierQuotes.map((supplierQuote, index) => (
              <Card key={supplierQuote.supplierId} className="glass-card animate-fadeIn mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Fornecedor: {supplierQuote.supplierName}</CardTitle>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeSupplier(supplierQuote.supplierId)}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" /> Remover
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox 
                        id={`select-all-${supplierQuote.supplierId}`} 
                        checked={supplierQuote.items.every(item => item.selected)}
                        onCheckedChange={(checked) => toggleSelectAll(supplierQuote.supplierId, !!checked)}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`select-all-${supplierQuote.supplierId}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        Selecionar todos
                      </label>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Selecionar</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Quantidade</TableHead>
                        <TableHead className="text-center">Valor Unitário</TableHead>
                        <TableHead className="text-center">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierQuote.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox 
                              checked={item.selected}
                              onCheckedChange={() => toggleItemSelection(supplierQuote.supplierId, item.id)}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              value={item.unitValue === 0 ? '' : item.unitValue}
                              onChange={(e) => updateItemUnitValue(
                                supplierQuote.supplierId, 
                                item.id, 
                                parseFloat(e.target.value) || 0
                              )}
                              className="max-w-[150px] mx-auto text-right"
                              placeholder="0,00"
                              step="0.01"
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {item.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">
                          Subtotal (Itens selecionados):
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {supplierQuote.items
                            .filter(item => item.selected)
                            .reduce((sum, item) => sum + item.totalValue, 0)
                            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          }
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
            
            <Card className="glass-card animate-fadeIn mb-6">
              <CardHeader>
                <CardTitle>Adicionar Fornecedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <Select onValueChange={(value) => addSupplier(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers
                          .filter(supplier => !supplierQuotes.some(sq => sq.supplierId === supplier.id))
                          .map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.nome}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const selectTrigger = document.querySelector('[id^="radix-:"]');
                      if (selectTrigger) {
                        (selectTrigger as HTMLElement).click();
                      }
                    }}
                    className="min-w-[140px]"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-semibold">
                Valor Total (Itens selecionados): 
                <span className="ml-2 text-primary">
                  {getTotalValue().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              
              <Button onClick={handleSaveQuote} size="lg" className="min-w-[180px]">
                <Save className="h-4 w-4 mr-2" /> 
                Salvar Cotação
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuoteForm;
