
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Search, 
  Plus,
  FileText,
  Building2,
  Phone,
  Mail
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewSupplierDialog from '@/components/NewSupplierDialog';

interface Supplier {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
}

const Suppliers = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, nome: 'Fornecedor A Ltda', cnpj: '12.345.678/0001-90', telefone: '(11) 99999-1234', email: 'contato@fornecedora.com' },
    { id: 2, nome: 'Fornecedor B S.A.', cnpj: '23.456.789/0001-01', telefone: '(11) 98888-5678', email: 'vendas@fornecedorb.com' },
    { id: 3, nome: 'Fornecedor C ME', cnpj: '34.567.890/0001-12', telefone: '(11) 97777-9012', email: 'atendimento@fornecedorc.com' },
    { id: 4, nome: 'Fornecedor D EPP', cnpj: '45.678.901/0001-23', telefone: '(11) 96666-3456', email: 'comercial@fornecedord.com' },
  ]);
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    supplier.cnpj.includes(searchTerm)
  );
  
  const handleAddSupplier = (supplier: { nome: string; cnpj: string; telefone: string; email: string }) => {
    const newSupplier = {
      id: suppliers.length + 1,
      ...supplier
    };
    setSuppliers([...suppliers, newSupplier]);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Fornecedores</h2>
                <p className="text-muted-foreground">
                  Gerencie todos os fornecedores
                </p>
              </div>
              
              <Button onClick={() => setSupplierDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Pesquisar fornecedores..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map(supplier => (
                <Card key={supplier.id} className="glass-card animate-fadeIn overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {supplier.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{supplier.cnpj}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{supplier.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{supplier.email}</span>
                      </div>
                      
                      <div className="pt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredSuppliers.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Nenhum fornecedor encontrado</p>
                </div>
              )}
            </div>
            
            <NewSupplierDialog 
              open={supplierDialogOpen} 
              onOpenChange={setSupplierDialogOpen}
              onSupplierAdded={handleAddSupplier}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Suppliers;
