
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ShoppingBag, 
  Plus, 
  Filter, 
  Search,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

const Purchases = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openQuoteDialog, setOpenQuoteDialog] = useState(false);
  const navigate = useNavigate();
  
  const mockPurchases = [
    { id: 1, ordem: 'OC-2023-001', fornecedor: 'Fornecedor A', valor: 'R$ 5.320,00', status: 'Em andamento', data: '10/05/2023' },
    { id: 2, ordem: 'OC-2023-002', fornecedor: 'Fornecedor B', valor: 'R$ 1.250,00', status: 'Finalizada', data: '22/05/2023' },
    { id: 3, ordem: 'OC-2023-003', fornecedor: 'Fornecedor C', valor: 'R$ 8.740,50', status: 'Em andamento', data: '03/06/2023' },
    { id: 4, ordem: 'OC-2023-004', fornecedor: 'Fornecedor D', valor: 'R$ 3.600,00', status: 'Finalizada', data: '15/06/2023' },
  ];

  const [suppliers] = useState([
    { id: 1, nome: 'Fornecedor A Ltda' },
    { id: 2, nome: 'Fornecedor B S.A.' },
    { id: 3, nome: 'Fornecedor C ME' },
    { id: 4, nome: 'Fornecedor D EPP' },
  ]);
  
  const handleNewPurchase = () => {
    setOpenQuoteDialog(true);
  };
  
  const handlePurchaseClick = (id: number) => {
    navigate(`/request/${id}`);
  };

  const filteredPurchases = mockPurchases.filter(purchase => {
    const matchesSearch = purchase.ordem.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         purchase.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? purchase.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  const form = useForm({
    defaultValues: {
      requestId: "",
      supplier1: "",
      supplier2: "",
      supplier3: "",
      items: [{ id: 1, description: "Item 1", quantity: 1, price1: 0, price2: 0, price3: 0 }]
    }
  });

  const [items, setItems] = useState([
    { id: 1, description: "Item 1", quantity: 1, price1: 0, price2: 0, price3: 0 }
  ]);

  const addItem = () => {
    const newItem = { 
      id: items.length + 1, 
      description: `Item ${items.length + 1}`, 
      quantity: 1, 
      price1: 0, 
      price2: 0, 
      price3: 0 
    };
    setItems([...items, newItem]);
  };

  const updateItemQuantity = (id: number, quantity: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const updateItemPrice = (id: number, supplier: number, price: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (supplier === 1) return { ...item, price1: price };
        if (supplier === 2) return { ...item, price2: price };
        if (supplier === 3) return { ...item, price3: price };
      }
      return item;
    }));
  };

  const calculateTotal = (supplier: number) => {
    return items.reduce((total, item) => {
      let price = 0;
      if (supplier === 1) price = item.price1;
      if (supplier === 2) price = item.price2;
      if (supplier === 3) price = item.price3;
      return total + (price * item.quantity);
    }, 0);
  };

  const onSubmit = (data: any) => {
    console.log("Submitting quote data:", { ...data, items });
    toast.success("Cotação salva com sucesso");
    setOpenQuoteDialog(false);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Cotações</h2>
                <p className="text-muted-foreground">
                  Gerencie todas as cotações de compras
                </p>
              </div>
              
              <Button onClick={handleNewPurchase}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Cotação
              </Button>
            </div>
            
            <Card className="glass-card animate-fadeIn">
              <CardHeader>
                <CardTitle>Cotações</CardTitle>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Pesquisar cotações..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Finalizada">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ordem</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fornecedor</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Valor</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((purchase) => (
                        <tr 
                          key={purchase.id}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium">{purchase.ordem}</td>
                          <td className="px-4 py-3 text-sm">{purchase.fornecedor}</td>
                          <td className="px-4 py-3 text-sm">{purchase.valor}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              purchase.status === 'Finalizada' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {purchase.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{purchase.data}</td>
                          <td className="px-4 py-3 text-sm">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handlePurchaseClick(purchase.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={openQuoteDialog} onOpenChange={setOpenQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Cotação</DialogTitle>
            <DialogDescription>
              Cadastre uma nova cotação com três fornecedores diferentes.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="requestId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>ID Solicitação</FormLabel>
                      <FormControl>
                        <Input placeholder="ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplier1"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Fornecedor 1</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplier2"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Fornecedor 2</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplier3"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Fornecedor 3</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Itens</h3>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Item
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-7 gap-2 mb-2 font-medium text-sm">
                    <div className="col-span-1">Item</div>
                    <div className="col-span-2">Descrição</div>
                    <div className="col-span-1">Qtd</div>
                    <div className="col-span-1">Preço Forn. 1</div>
                    <div className="col-span-1">Preço Forn. 2</div>
                    <div className="col-span-1">Preço Forn. 3</div>
                  </div>
                  
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-7 gap-2 mb-3">
                      <div className="col-span-1 flex items-center">{item.id}</div>
                      <div className="col-span-2">
                        <Input 
                          value={item.description}
                          onChange={(e) => {
                            setItems(items.map(i => 
                              i.id === item.id ? { ...i, description: e.target.value } : i
                            ));
                          }}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input 
                          type="number" 
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input 
                          type="number" 
                          step="0.01"
                          min="0"
                          value={item.price1}
                          onChange={(e) => updateItemPrice(item.id, 1, Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input 
                          type="number" 
                          step="0.01"
                          min="0"
                          value={item.price2}
                          onChange={(e) => updateItemPrice(item.id, 2, Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input 
                          type="number" 
                          step="0.01"
                          min="0"
                          value={item.price3}
                          onChange={(e) => updateItemPrice(item.id, 3, Number(e.target.value))}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-7 gap-2 mt-6 pt-4 border-t">
                    <div className="col-span-3 text-right font-medium">Total:</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1 font-bold">
                      R$ {calculateTotal(1).toFixed(2).replace('.', ',')}
                    </div>
                    <div className="col-span-1 font-bold">
                      R$ {calculateTotal(2).toFixed(2).replace('.', ',')}
                    </div>
                    <div className="col-span-1 font-bold">
                      R$ {calculateTotal(3).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpenQuoteDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Cotação</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Purchases;
