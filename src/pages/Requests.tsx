
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockRequests } from '@/utils/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const Requests = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Apply filters to the list of requests
  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = 
      request.application.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.costCenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(request.id).includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' ? true : request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' ? true : request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Solicitações</h2>
                <p className="text-muted-foreground">
                  Gerencie todas as solicitações de compra
                </p>
              </div>
              
              <Button onClick={() => navigate('/request/new')}>
                <FileText className="mr-2 h-4 w-4" />
                Nova Solicitação
              </Button>
            </div>
            
            <div className="bg-card border rounded-lg overflow-hidden glass-card animate-fadeIn">
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Pesquisar solicitações..." 
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
                        <SelectItem value="Solicitado">Solicitado</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Em Cotação">Em Cotação</SelectItem>
                        <SelectItem value="Aprovado para Compra">Aprovado para Compra</SelectItem>
                        <SelectItem value="Aquisitado">Aquisitado</SelectItem>
                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                        <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="h-4 w-4" />
                          <span>Prioridade</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                        <SelectItem value="Moderada">Moderada</SelectItem>
                        <SelectItem value="Básica">Básica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Aplicação</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Solicitante</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">CC</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Prioridade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <tr 
                        key={request.id}
                        className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => navigate(`/requests/${request.id}`)}
                      >
                        <td className="px-4 py-3 text-sm">{request.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{request.application}</td>
                        <td className="px-4 py-3 text-sm">{request.requesterName}</td>
                        <td className="px-4 py-3 text-sm">{request.costCenter}</td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge type="status" value={request.status} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge type="priority" value={request.priority} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredRequests.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Requests;
