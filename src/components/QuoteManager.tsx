
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Updated Quote interface to match ManageQuotesButton
interface Quote {
  id: number;
  code: string;
  title: string;
  date: string;
  status: string; // Changed to string to match API response
  totalValue: number;
}

interface QuoteManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: number;
  quotes: Quote[];
}

const QuoteManager = ({ open, onOpenChange, requestId, quotes = [] }: QuoteManagerProps) => {
  const navigate = useNavigate();
  
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
