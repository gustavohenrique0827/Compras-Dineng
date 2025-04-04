
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  FileText, 
  Plus, 
  Filter, 
  Search,
  ShoppingCart,
  Eye,
  CheckCircle,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QuoteComparison from '@/components/QuoteComparison';
import { fetchQuoteRequests, fetchSuppliers, createNewQuote, QuoteItem, Supplier as ApiSupplier, QuoteData } from '@/api/quotes';

// Interface para cotações
interface Quote {
  id: number;
  ordem: string;
  fornecedor: string;
  valor: string;
  status: string;
  data: string;
  solicitacao_id?: number;
}

// Extend our internal supplier interface to match the API interface
interface SupplierWithItems extends ApiSupplier {
  nome?: string; // For compatibility with database suppliers
}

const Purchases = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openQuoteDialog, setOpenQuoteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const navigate = useNavigate();
  
  // Estado para armazenar as cotações carregadas do banco de dados
  const [quotes, setQuotes] = useState<Quote[]>([]);
  // Estado para armazenar os fornecedores do banco de dados
  const [suppliers, setSuppliers] = useState<SupplierWithItems[]>([]);
  // Estado para armazenar solicitações disponíveis para cotação
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  // Estado para o fornecedor selecionado na dialog de nova cotação
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  // Estado para fornecedores adicionados à cotação
  const [addedSuppliers, setAddedSuppliers] = useState<SupplierWithItems[]>([]);
  // Estado para os itens da cotação
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  // Setup form
  const quoteForm = useForm({
    defaultValues: {
      requestId: "",
      supplier: ""
    }
  });

  // Carregando fornecedores e solicitações para cotação
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedSuppliers = await fetchSuppliers();
        setSuppliers(loadedSuppliers);
        
        const loadedRequests = await fetchQuoteRequests();
        setQuoteRequests(loadedRequests);
        
        // Carregar cotações existentes (aqui usamos mock por enquanto)
        setQuotes([
          { id: 1, ordem: 'OC-2023-001', fornecedor: 'Fornecedor A', valor: 'R$ 5.320,00', status: 'Em andamento', data: '10/05/2023', solicitacao_id: 1 },
          { id: 2, ordem: 'OC-2023-002', fornecedor: 'Fornecedor B', valor: 'R$ 1.250,00', status: 'Finalizada', data: '22/05/2023', solicitacao_id: 2 },
          { id: 3, ordem: 'OC-2023-003', fornecedor: 'Fornecedor C', valor: 'R$ 8.740,50', status: 'Em andamento', data: '03/06/2023', solicitacao_id: 3 }
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        toast.error('Erro ao carregar dados');
      }
    };
    
    loadData();
  }, []);

  // Função para adicionar fornecedor à cotação
  const addSupplierToQuote = () => {
    if (!selectedSupplier) {
      toast.error('Selecione um fornecedor');
      return;
    }
    
    const supplierExists = addedSuppliers.some(s => s.id === selectedSupplier);
    if (supplierExists) {
      toast.error('Este fornecedor já foi adicionado');
      return;
    }
    
    const supplier = suppliers.find(s => s.id === selectedSupplier);
    if (supplier) {
      setAddedSuppliers([...addedSuppliers, {
        id: supplier.id,
        name: supplier.nome || supplier.name || "",
        items: []
      }]);
      toast.success(`Fornecedor ${supplier.nome || supplier.name} adicionado`);
      setSelectedSupplier(null);
    }
  };

  // Função para remover fornecedor da cotação
  const removeSupplierFromQuote = (supplierId: number) => {
    setAddedSuppliers(addedSuppliers.filter(s => s.id !== supplierId));
    // Também remover todos os itens deste fornecedor
    setItems(items.filter(item => item.supplierId !== supplierId));
  };

  // Função para adicionar item à cotação
  const addItemToQuote = () => {
    if (!newItemName.trim()) {
      toast.error('Informe o nome do item');
      return;
    }
    
    if (newItemQuantity <= 0) {
      toast.error('A quantidade deve ser maior que zero');
      return;
    }
    
    if (addedSuppliers.length === 0) {
      toast.error('Adicione pelo menos um fornecedor primeiro');
      return;
    }
    
    // Criar um item para cada fornecedor
    const newItems = addedSuppliers.map(supplier => ({
      id: Date.now() + Math.random(),  // ID temporário único
      itemName: newItemName,
      quantity: newItemQuantity,
      price: 0,
      supplierId: supplier.id
    }));
    
    setItems([...items, ...newItems]);
    setNewItemName('');
    setNewItemQuantity(1);
    toast.success('Item adicionado para todos os fornecedores');
  };

  // Função para remover item
  const removeItem = (itemId: number) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Atualizar quantidade de um item
  const updateItemQuantity = (itemId: number, quantity: number) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  // Atualizar preço de um item
  const updateItemPrice = (itemId: number, price: number) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, price } : item
    ));
  };

  // Calcular valor total para um fornecedor
  const calculateSupplierTotal = (supplierId: number) => {
    return items
      .filter(item => item.supplierId === supplierId)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleNewQuote = () => {
    setOpenQuoteDialog(true);
    // Limpar dados do formulário anterior
    setSelectedRequestId(null);
    setAddedSuppliers([]);
    setItems([]);
    setNewItemName('');
    setNewItemQuantity(1);
  };
  
  const handleViewQuoteDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setOpenDetailsDialog(true);
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.ordem.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         quote.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : quote.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Função para salvar a cotação
  const handleSaveQuote = async () => {
    if (!selectedRequestId) {
      toast.error("Selecione uma solicitação");
      return;
    }
    
    if (addedSuppliers.length === 0) {
      toast.error("Adicione pelo menos um fornecedor");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Adicione pelo menos um item");
      return;
    }

    // Verificar se todos os itens têm preço válido
    const invalidItem = items.find(item => item.price <= 0);
    if (invalidItem) {
      toast.error(`Informe um preço válido para o item ${invalidItem.itemName}`);
      return;
    }

    try {
      // Preparar dados para salvar
      const quoteData: QuoteData = {
        requestId: selectedRequestId,
        items: items,
        status: "Em Cotação",
        totalValue: items.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
      
      await createNewQuote(quoteData);
      setOpenQuoteDialog(false);
      
      // Atualizar a lista de cotações
      const newQuote = {
        id: quotes.length + 1,
        ordem: `OC-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`,
        fornecedor: addedSuppliers.map(s => s.name).join(', '),
        valor: `R$ ${quoteData.totalValue.toFixed(2)}`,
        status: 'Em andamento',
        data: new Date().toLocaleDateString('pt-BR'),
        solicitacao_id: selectedRequestId
      };
      
      setQuotes([...quotes, newQuote]);
      toast.success("Cotação salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar cotação:", error);
      toast.error("Erro ao salvar cotação");
    }
  };

  // Mock function for handling the completion of quote comparison
  const handleQuoteComparisonFinish = (selectedItems: any[]) => {
    console.log("Selected items:", selectedItems);
    toast.success("Detalhes da cotação visualizados");
    setOpenDetailsDialog(false);
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
              
              <Button onClick={handleNewQuote}>
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
                      <SelectItem value="all">Todos os status</SelectItem>
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
                      {filteredQuotes.map((quote) => (
                        <tr 
                          key={quote.id}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium">{quote.ordem}</td>
                          <td className="px-4 py-3 text-sm">{quote.fornecedor}</td>
                          <td className="px-4 py-3 text-sm">{quote.valor}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              quote.status === 'Finalizada' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{quote.data}</td>
                          <td className="px-4 py-3 text-sm">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewQuoteDetails(quote)}
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

      {/* Dialog para Nova Cotação - Reorganizado */}
      <Dialog open={openQuoteDialog} onOpenChange={setOpenQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Cotação</DialogTitle>
            <DialogDescription>
              Cadastre uma nova cotação com fornecedores diferentes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Seleção da Solicitação */}
            <div className="mb-6">
              <FormLabel className="text-lg font-medium">Solicitação</FormLabel>
              <Select 
                value={selectedRequestId?.toString() || ""} 
                onValueChange={(value) => setSelectedRequestId(Number(value))}
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Selecione a solicitação" />
                </SelectTrigger>
                <SelectContent>
                  {quoteRequests.map(request => (
                    <SelectItem key={request.id} value={request.id.toString()}>
                      {request.id} - {request.aplicacao || request.nome_solicitante}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Seleção de Fornecedores */}
            <Form {...quoteForm}>
              <form className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Fornecedores</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select 
                    value={selectedSupplier?.toString() || ""} 
                    onValueChange={(value) => setSelectedSupplier(Number(value))}
                  >
                    <SelectTrigger className="min-w-[250px]">
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.nome || supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={addSupplierToQuote}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
              </form>
            </Form>
            
            {/* Lista de fornecedores adicionados */}
            {addedSuppliers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {addedSuppliers.map(supplier => (
                  <div key={supplier.id} className="bg-muted px-3 py-1 rounded-md flex items-center gap-2">
                    <span>{supplier.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 w-5 p-0 rounded-full"
                      onClick={() => removeSupplierFromQuote(supplier.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Adição de Itens */}
            {addedSuppliers.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Itens</h3>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Nome do item" 
                      className="w-[250px]" 
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Input 
                      type="number" 
                      placeholder="Qtd" 
                      className="w-20" 
                      min="1"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                    />
                    <Button type="button" variant="outline" onClick={addItemToQuote}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar Item
                    </Button>
                  </div>
                </div>
                
                {/* Tabelas de Itens por Fornecedor */}
                {addedSuppliers.map(supplier => (
                  <Card key={supplier.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{supplier.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table className="border">
                        <TableHeader className="bg-blue-800 text-white">
                          <TableRow>
                            <TableHead className="text-white">Item</TableHead>
                            <TableHead className="text-center text-white w-[100px]">Qtd</TableHead>
                            <TableHead className="text-center text-white">Valor unitário</TableHead>
                            <TableHead className="text-center text-white">Valor total</TableHead>
                            <TableHead className="text-center text-white w-20">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items
                            .filter(item => item.supplierId === supplier.id)
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell className="text-center">
                                  <Input 
                                    type="number" 
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                                    className="max-w-[80px] mx-auto text-center"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    value={item.price}
                                    onChange={(e) => updateItemPrice(item.id, Number(e.target.value))}
                                    className="max-w-[150px] mx-auto text-right"
                                    placeholder="0,00"
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-medium">
                              Subtotal:
                            </TableCell>
                            <TableCell className="text-center font-medium">
                              R$ {calculateSupplierTotal(supplier.id).toFixed(2)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
              
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpenQuoteDialog(false)}>
                Cancelar
              </Button>
              <Button 
                type="button" 
                className="bg-green-500 hover:bg-green-600"
                onClick={handleSaveQuote}
              >
                Salvar Cotação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Detalhes da Cotação */}
      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Cotação</DialogTitle>
            <DialogDescription>
              {selectedQuote && (
                <span>Cotação: {selectedQuote.ordem} | Solicitação: #{selectedQuote.solicitacao_id || 'N/A'}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <QuoteComparison 
              suppliers={[
                {
                  id: 1,
                  name: "Fornecedor A",
                  items: [
                    { id: 1, itemName: "Peça de reposição", quantity: 2, price: 120.00, supplierId: 1 },
                    { id: 2, itemName: "Ferramenta", quantity: 1, price: 80.00, supplierId: 1 }
                  ]
                },
                {
                  id: 2,
                  name: "Fornecedor B",
                  items: [
                    { id: 3, itemName: "Peça de reposição", quantity: 2, price: 135.00, supplierId: 2 },
                    { id: 4, itemName: "Ferramenta", quantity: 1, price: 75.00, supplierId: 2 }
                  ]
                }
              ]}
              onFinish={handleQuoteComparisonFinish}
              onCancel={() => setOpenDetailsDialog(false)}
              viewOnly={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Purchases;
