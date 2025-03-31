
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText,
  Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

// Dados de exemplo para cotações
const cotacoesExemplo = [
  { id: 1, codigo: 'CC-3308', titulo: 'Reparo de moto', data: '2023-06-15', status: 'Pendente', valor: 550 },
  { id: 2, codigo: 'CC-3309', titulo: 'Manutenção de equipamento', data: '2023-06-16', status: 'Aprovado', valor: 1200 },
  { id: 3, codigo: 'CC-3310', titulo: 'Compra de materiais', data: '2023-06-17', status: 'Rejeitado', valor: 350 },
  { id: 4, codigo: 'CC-3311', titulo: 'Insumos para escritório', data: '2023-06-18', status: 'Pendente', valor: 450 },
];

const Cotacoes = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filtrar cotações com base na busca e no filtro de status
  const filteredCotacoes = cotacoesExemplo.filter(cotacao => {
    const matchesSearch = 
      cotacao.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cotacao.id).includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' ? true : cotacao.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
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
                  Gerencie todas as cotações de compra
                </p>
              </div>
              
              <Button onClick={() => navigate('/cotacoes/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Cotação
              </Button>
            </div>
            
            <div className="bg-card border rounded-lg overflow-hidden glass-card animate-fadeIn">
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Pesquisar cotações..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>Status</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Código</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Título</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCotacoes.length > 0 ? (
                      filteredCotacoes.map((cotacao) => (
                        <tr 
                          key={cotacao.id}
                          className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                          onClick={() => navigate(`/cotacoes/${cotacao.id}`)}
                        >
                          <td className="px-4 py-3 text-sm">{cotacao.codigo}</td>
                          <td className="px-4 py-3 text-sm font-medium">{cotacao.titulo}</td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(cotacao.data).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(cotacao.status)}`}>
                              {cotacao.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {cotacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          Nenhuma cotação encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cotacoes;
