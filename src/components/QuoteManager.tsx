
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Quote {
  id: number;
  code: string;
  title: string;
  date: string;
  items: {
    itemId: number;
    supplierId: number;
    supplierName: string;
    itemName: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
    selected: boolean;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  totalValue: number;
}

interface QuoteManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: number;
}

const QuoteManager = ({ open, onOpenChange, requestId }: QuoteManagerProps) => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 101,
      code: 'CC-3308',
      title: 'Reparo de moto',
      date: '2023-06-15',
      status: 'pending',
      totalValue: 550,
      items: [
        { itemId: 1, supplierId: 1, supplierName: 'Fornecedor A Ltda', itemName: 'Peça de Motor', quantity: 2, unitValue: 150, totalValue: 300, selected: true },
        { itemId: 2, supplierId: 1, supplierName: 'Fornecedor A Ltda', itemName: 'Filtro de Óleo', quantity: 1, unitValue: 45, totalValue: 45, selected: true },
        { itemId: 3, supplierId: 3, supplierName: 'Fornecedor C ME', itemName: 'Óleo Lubrificante', quantity: 3, unitValue: 25, totalValue: 75, selected: true },
        { itemId: 4, supplierId: 2, supplierName: 'Fornecedor B S.A.', itemName: 'Pastilha de Freio', quantity: 4, unitValue: 32.5, totalValue: 130, selected: true },
      ]
    }
  ]);
  
  const handleViewQuote = (quoteId: number) => {
    navigate(`/cotacoes/${quoteId}`);
    onOpenChange(false);
  };
  
  const handleCreateQuote = () => {
    navigate('/cotacoes/new');
    onOpenChange(false);
  };
  
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      default:
        return 'Pendente';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Cotações</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.length > 0 ? (
                quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>{quote.code}</TableCell>
                    <TableCell>{quote.title}</TableCell>
                    <TableCell>{formatDate(quote.date)}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {quote.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewQuote(quote.id)}
                      >
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhuma cotação encontrada para esta solicitação.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button onClick={handleCreateQuote}>Nova Cotação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteManager;
