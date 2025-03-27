
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
  Mail
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Suppliers = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockSuppliers = [
    { id: 1, nome: 'Fornecedor A Ltda', categoria: 'Equipamentos', contato: 'João Silva', telefone: '(11) 98765-4321', email: 'contato@fornecedora.com' },
    { id: 2, nome: 'Fornecedor B S.A.', categoria: 'Materiais', contato: 'Maria Oliveira', telefone: '(11) 91234-5678', email: 'vendas@fornecedorb.com' },
    { id: 3, nome: 'Fornecedor C ME', categoria: 'Serviços', contato: 'Carlos Santos', telefone: '(11) 99876-5432', email: 'carlos@fornecedorc.com' },
    { id: 4, nome: 'Fornecedor D EPP', categoria: 'Manutenção', contato: 'Ana Souza', telefone: '(11) 92345-6789', email: 'contato@fornecedord.com' },
  ];
  
  const handleNewSupplier = () => {
    toast.success('Funcionalidade de Novo Fornecedor em implementação');
  };
  
  const handleSupplierClick = (id: number) => {
    toast.info(`Detalhes do Fornecedor ${id}`);
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
                  {mockSuppliers.map((supplier) => (
                    <div 
                      key={supplier.id}
                      className="border rounded-lg p-4 hover:border-primary/30 transition-all cursor-pointer"
                      onClick={() => handleSupplierClick(supplier.id)}
                    >
                      <h3 className="font-medium text-lg">{supplier.nome}</h3>
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
                      </div>
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

export default Suppliers;
