
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Save,
  Trash
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

interface QuoteItem {
  id: number;
  name: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

interface SupplierQuote {
  supplierId: number;
  supplierName: string;
  items: QuoteItem[];
}

const QuoteForm = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [quoteTitle, setQuoteTitle] = useState('Reparo de moto');
  const [quoteCode, setQuoteCode] = useState('CC-3308');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  
  const [supplierQuotes, setSupplierQuotes] = useState<SupplierQuote[]>([]);

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
      items: []
    };

    setSupplierQuotes([...supplierQuotes, newSupplierQuote]);
    toast.success(`Fornecedor ${selectedSupplier.nome} adicionado à cotação.`);
  };

  const removeSupplier = (supplierId: number) => {
    setSupplierQuotes(supplierQuotes.filter(sq => sq.supplierId !== supplierId));
    toast.info('Fornecedor removido da cotação.');
  };

  const addItemToSupplier = (supplierId: number) => {
    if (!newItemName.trim()) {
      toast.error('Por favor, informe o nome do item.');
      return;
    }

    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        const newItem: QuoteItem = {
          id: sq.items.length > 0 ? Math.max(...sq.items.map(item => item.id)) + 1 : 1,
          name: newItemName,
          quantity: newItemQuantity,
          unitValue: 0,
          totalValue: 0
        };
        return {
          ...sq,
          items: [...sq.items, newItem]
        };
      }
      return sq;
    }));

    setNewItemName('');
    setNewItemQuantity(1);
  };

  const removeItemFromSupplier = (supplierId: number, itemId: number) => {
    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        return {
          ...sq,
          items: sq.items.filter(item => item.id !== itemId)
        };
      }
      return sq;
    }));
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

  const updateItemQuantity = (supplierId: number, itemId: number, quantity: number) => {
    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        return {
          ...sq,
          items: sq.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                quantity,
                totalValue: item.unitValue * quantity
              };
            }
            return item;
          })
        };
      }
      return sq;
    }));
  };

  const getTotalValue = () => {
    let total = 0;
    supplierQuotes.forEach(sq => {
      sq.items.forEach(item => {
        total += item.totalValue;
      });
    });
    return total;
  };

  const handleSaveQuote = () => {
    if (supplierQuotes.length === 0) {
      toast.error('Adicione pelo menos um fornecedor para salvar a cotação.');
      return;
    }

    const anyItems = supplierQuotes.some(sq => sq.items.length > 0);
    if (!anyItems) {
      toast.error('Adicione pelo menos um item para algum fornecedor.');
      return;
    }

    const quote = {
      code: quoteCode,
      title: quoteTitle,
      date: new Date().toISOString(),
      suppliers: supplierQuotes,
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
              <h2 className="text-2xl font-bold text-center">Nova Cotação</h2>
            </div>
            
            <Card className="glass-card animate-fadeIn mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Cotação</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-base">{quoteCode}</div>
                      <div className="text-base">{quoteTitle}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                      onClick={() => {
                        const selectTrigger = document.querySelector('[id^="radix-:"]');
                        if (selectTrigger) {
                          (selectTrigger as HTMLElement).click();
                        }
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {supplierQuotes.map((supplierQuote) => (
              <Card key={supplierQuote.supplierId} className="glass-card animate-fadeIn mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Fornecedor: {supplierQuote.supplierName}</CardTitle>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeSupplier(supplierQuote.supplierId)}
                    className="h-8"
                  >
                    <Trash className="h-4 w-4 mr-1" /> Remover
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Nome do item" 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                      />
                      <Input 
                        type="number" 
                        placeholder="Quantidade" 
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                        className="w-24"
                        min="1"
                      />
                      <Button onClick={() => addItemToSupplier(supplierQuote.supplierId)}>
                        <Plus className="h-4 w-4 mr-1" /> Item
                      </Button>
                    </div>
                  </div>

                  <Table className="border">
                    <TableHeader className="bg-blue-800 text-white">
                      <TableRow>
                        <TableHead className="text-white">Item</TableHead>
                        <TableHead className="text-center text-white">Quant</TableHead>
                        <TableHead className="text-center text-white">Valor unitário</TableHead>
                        <TableHead className="text-center text-white">Valor total</TableHead>
                        <TableHead className="text-center text-white w-20">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierQuote.items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Nenhum item adicionado para este fornecedor.
                          </TableCell>
                        </TableRow>
                      ) : (
                        supplierQuote.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-center">
                              <Input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => updateItemQuantity(
                                  supplierQuote.supplierId,
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )}
                                className="max-w-[80px] mx-auto text-center"
                                min="1"
                              />
                            </TableCell>
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
                            <TableCell className="text-center">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeItemFromSupplier(supplierQuote.supplierId, item.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      {supplierQuote.items.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Subtotal:
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {supplierQuote.items
                              .reduce((sum, item) => sum + item.totalValue, 0)
                              .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            }
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-end mb-6">
              <Button onClick={handleSaveQuote} size="lg" className="min-w-[180px] bg-green-500 hover:bg-green-600">
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
