
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
  ShoppingCart
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Purchases = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockPurchases = [
    { id: 1, ordem: 'OC-2023-001', fornecedor: 'Fornecedor A', valor: 'R$ 5.320,00', status: 'Em andamento', data: '10/05/2023' },
    { id: 2, ordem: 'OC-2023-002', fornecedor: 'Fornecedor B', valor: 'R$ 1.250,00', status: 'Finalizada', data: '22/05/2023' },
    { id: 3, ordem: 'OC-2023-003', fornecedor: 'Fornecedor C', valor: 'R$ 8.740,50', status: 'Em andamento', data: '03/06/2023' },
    { id: 4, ordem: 'OC-2023-004', fornecedor: 'Fornecedor D', valor: 'R$ 3.600,00', status: 'Finalizada', data: '15/06/2023' },
  ];
  
  const handleNewPurchase = () => {
    toast.success('Funcionalidade de Nova Compra em implementação');
  };
  
  const handlePurchaseClick = (id: number) => {
    toast.info(`Detalhes da Compra ${id}`);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Compras</h2>
                <p className="text-muted-foreground">
                  Gerencie todas as compras realizadas
                </p>
              </div>
              
              <Button onClick={handleNewPurchase}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Compra
              </Button>
            </div>
            
            <Card className="glass-card animate-fadeIn">
              <CardHeader>
                <CardTitle>Ordens de Compra</CardTitle>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Pesquisar compras..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
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
                      </tr>
                    </thead>
                    <tbody>
                      {mockPurchases.map((purchase) => (
                        <tr 
                          key={purchase.id}
                          className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                          onClick={() => handlePurchaseClick(purchase.id)}
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
    </div>
  );
};

export default Purchases;
