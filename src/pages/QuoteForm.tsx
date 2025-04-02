
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useQuoteForm } from '@/hooks/useQuoteForm';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { fetchQuoteRequests } from '@/api/quotes';
import { useQuery } from '@tanstack/react-query';
import { getAllSuppliers } from '@/utils/database';

const QuoteForm = () => {
  const isMobile = useIsMobile();
  const [costCenter, setCostCenter] = useState('');
  const [availableRequests, setAvailableRequests] = useState<any[]>([]);
  
  // Fetch available requests for quotation
  const { data: requests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ['quoteRequests'],
    queryFn: fetchQuoteRequests,
    onError: (error) => {
      console.error('Error fetching requests:', error);
      toast.error('Erro ao carregar solicitações disponíveis');
    }
  });
  
  // Fetch available suppliers
  const { data: suppliersList = [], isLoading: loadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getAllSuppliers,
    onError: (error) => {
      console.error('Error fetching suppliers:', error);
      toast.error('Erro ao carregar fornecedores');
    }
  });
  
  useEffect(() => {
    if (requests.length > 0) {
      setAvailableRequests(requests);
    }
  }, [requests]);

  const {
    quoteTitle,
    quoteCode,
    newItemName,
    newItemQuantity,
    supplierQuotes,
    suppliers,
    setNewItemName,
    setNewItemQuantity,
    addSupplier,
    removeSupplier,
    addItemToSupplier,
    removeItemFromSupplier,
    updateItemUnitValue,
    updateItemQuantity,
    getTotalValue,
    handleSaveQuote
  } = useQuoteForm();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Nova Cotação</h2>
                  <p className="text-muted-foreground">Cadastre uma cotação com fornecedores diferentes.</p>
                </div>
                
                {/* Quote ID and Title */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">ID / Centro de Custo</h3>
                      <Select onValueChange={setCostCenter}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRequests.map(request => (
                            <SelectItem key={request.id} value={request.centro_custo}>
                              {request.centro_custo} - {request.aplicacao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                      <div className="text-base font-medium">{quoteTitle}</div>
                    </div>
                  </div>
                </div>
                
                {/* Supplier Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Fornecedores</h3>
                    <Button 
                      onClick={() => {
                        const selectTrigger = document.querySelector('[id^="radix-:"]');
                        if (selectTrigger) {
                          (selectTrigger as HTMLElement).click();
                        }
                      }}
                      className="bg-green-500 hover:bg-green-600"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Adicionar Fornecedor
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Select onValueChange={(value) => addSupplier(parseInt(value))}>
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingSuppliers ? (
                          <SelectItem value="loading" disabled>Carregando fornecedores...</SelectItem>
                        ) : (
                          suppliersList
                            .filter(supplier => !supplierQuotes.some(sq => sq.supplierId === supplier.id))
                            .map(supplier => (
                              <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                {supplier.nome}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    {supplierQuotes.map((sq, index) => (
                      <div key={sq.supplierId} className="bg-muted p-2 rounded-md flex items-center gap-2">
                        <span>Fornecedor {index + 1}: {sq.supplierName}</span>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => removeSupplier(sq.supplierId)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Items Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Itens</h3>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Nome do item" 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-[250px]"
                      />
                      <Input 
                        type="number" 
                        placeholder="Quantidade" 
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                        className="w-24"
                        min="1"
                      />
                      <Button 
                        onClick={() => {
                          if (supplierQuotes.length === 0) {
                            toast.error("Adicione pelo menos um fornecedor primeiro");
                            return;
                          }
                          
                          // Add item to all suppliers
                          supplierQuotes.forEach(sq => addItemToSupplier(sq.supplierId));
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Adicionar Item
                      </Button>
                    </div>
                  </div>
                  
                  {supplierQuotes.length > 0 ? (
                    <div className="space-y-6">
                      {supplierQuotes.map((supplierQuote) => (
                        <Card key={supplierQuote.supplierId} className="glass-card animate-fadeIn">
                          <CardContent className="pt-6">
                            <h4 className="text-lg font-semibold mb-4">Fornecedor: {supplierQuote.supplierName}</h4>
                            
                            <Table className="border">
                              <TableHeader className="bg-blue-800 text-white">
                                <TableRow>
                                  <TableHead className="text-white">Item</TableHead>
                                  <TableHead className="text-center text-white w-[150px]">Quant</TableHead>
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
                                  <>
                                    {supplierQuote.items.map((item) => (
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
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow>
                                      <TableCell colSpan={3} className="text-right font-medium">
                                        Total:
                                      </TableCell>
                                      <TableCell className="text-center font-medium">
                                        {supplierQuote.items
                                          .reduce((sum, item) => sum + item.totalValue, 0)
                                          .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                        }
                                      </TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                  </>
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">
                        Adicione pelo menos um fornecedor para começar a inserir itens
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4 mb-6">
              <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                Cancelar
              </Button>
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
