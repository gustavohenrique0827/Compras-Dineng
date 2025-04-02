import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Users, 
  Plus, 
  Search,
  MapPin,
  Phone,
  Mail,
  Building,
  X,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Supplier {
  id: number;
  nome: string;
  cnpj: string;
  categoria: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
}

const Suppliers = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, nome: 'Fornecedor A Ltda', cnpj: '12.345.678/0001-90', categoria: 'Equipamentos', contato: 'João Silva', telefone: '(11) 98765-4321', email: 'contato@fornecedora.com', endereco: 'Rua A, 123 - São Paulo/SP', cidade: 'São Paulo', estado: 'SP', cep: '01234-567', observacoes: 'Fornecedor confiável de equipamentos.' },
    { id: 2, nome: 'Fornecedor B S.A.', cnpj: '23.456.789/0001-01', categoria: 'Materiais', contato: 'Maria Oliveira', telefone: '(11) 91234-5678', email: 'vendas@fornecedorb.com', endereco: 'Av. B, 456 - Rio de Janeiro/RJ', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20000-123', observacoes: 'Ótimos preços para materiais de construção.' },
    { id: 3, nome: 'Fornecedor C ME', cnpj: '34.567.890/0001-12', categoria: 'Serviços', contato: 'Carlos Santos', telefone: '(11) 99876-5432', email: 'carlos@fornecedorc.com', endereco: 'Praça C, 789 - Belo Horizonte/MG', cidade: 'Belo Horizonte', estado: 'MG', cep: '30000-789', observacoes: 'Especializado em serviços elétricos.' },
    { id: 4, nome: 'Fornecedor D EPP', cnpj: '45.678.901/0001-23', categoria: 'Manutenção', contato: 'Ana Souza', telefone: '(11) 92345-6789', email: 'contato@fornecedord.com', endereco: 'Alameda D, 1011 - Brasília/DF', cidade: 'Brasília', estado: 'DF', cep: '70000-101', observacoes: 'Manutenção preventiva e corretiva.' },
  ]);
  
  const handleNewSupplier = () => {
    setOpenSupplierDialog(true);
  };
  
  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenDetailsDialog(true);
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.cnpj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm({
    defaultValues: {
      nome: "",
      cnpj: "",
      categoria: "",
      contato: "",
      telefone: "",
      email: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      observacoes: ""
    }
  });

  const onSubmit = (data: any) => {
    const newSupplier = {
      id: suppliers.length + 1,
      ...data
    };
    
    setSuppliers([...suppliers, newSupplier]);
    toast.success("Fornecedor cadastrado com sucesso");
    setOpenSupplierDialog(false);
    form.reset();
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Fornecedores</h2>
                <p className="text-muted-foreground">
                  Gerencie todos os fornecedores cadastrados
                </p>
              </div>
              
              <Button onClick={handleNewSupplier}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Fornecedor
              </Button>
            </div>
            
            <Card className="glass-card animate-fadeIn">
              <CardHeader>
                <CardTitle>Fornecedores Cadastrados</CardTitle>
                <div className="mt-4 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Pesquisar fornecedores..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuppliers.map((supplier) => (
                    <div 
                      key={supplier.id}
                      className="border rounded-lg p-4 hover:border-primary/30 transition-all cursor-pointer"
                      onClick={() => handleSupplierClick(supplier)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{supplier.nome}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSupplierClick(supplier);
                          }}
                        >
                          <ArrowRight className="h-4 w-4" /> 
                          <span className="ml-1">Detalhes</span>
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 mb-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">CNPJ: {supplier.cnpj}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        Categoria: {supplier.categoria}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.contato}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.telefone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.endereco}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={openSupplierDialog} onOpenChange={setOpenSupplierDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Fornecedor</DialogTitle>
            <DialogDescription>
              Cadastre um novo fornecedor no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome/Razão Social</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do fornecedor" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000/0000-00" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                          <SelectItem value="Materiais">Materiais</SelectItem>
                          <SelectItem value="Serviços">Serviços</SelectItem>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pessoa de Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do contato" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" {...field} maxLength={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Input placeholder="Observações adicionais" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpenSupplierDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Fornecedor</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          {selectedSupplier && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-xl">{selectedSupplier.nome}</DialogTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setOpenDetailsDialog(false)} 
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">CNPJ: {selectedSupplier.cnpj}</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  Categoria: {selectedSupplier.categoria}
                </p>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <h4 className="font-medium mb-2">Informações de Contato</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSupplier.contato}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSupplier.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSupplier.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Informações de Endereço</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSupplier.endereco}</span>
                    </div>
                    {selectedSupplier.cidade && selectedSupplier.estado && (
                      <div className="ml-6">
                        <span>{selectedSupplier.cidade} - {selectedSupplier.estado}</span>
                      </div>
                    )}
                    {selectedSupplier.cep && (
                      <div className="ml-6">
                        <span>CEP: {selectedSupplier.cep}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedSupplier.observacoes && (
                <div className="pt-2 border-t">
                  <h4 className="font-medium mb-2">Observações</h4>
                  <p className="text-sm">{selectedSupplier.observacoes}</p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDetailsDialog(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suppliers;
