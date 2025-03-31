
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import QuoteManager from './QuoteManager';
import { useQuery } from '@tanstack/react-query';
import { getQuotesForRequest } from '@/api/quotes';

interface ManageQuotesButtonProps {
  requestId: number;
  status: string;
}

// Updated Quote interface to accept any string for status
interface Quote {
  id: number;
  code: string;
  title: string;
  date: string;
  status: string;
  totalValue: number;
}

const ManageQuotesButton = ({ requestId, status }: ManageQuotesButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Prefetch quotes data
  const { data: quotes } = useQuery({
    queryKey: ['quotes', requestId],
    queryFn: () => getQuotesForRequest(requestId),
    enabled: status === 'Em Cotação'
  });
  
  // Somente mostrar o botão se o status for "Em Cotação"
  if (status !== 'Em Cotação') {
    return null;
  }
  
  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setDialogOpen(true)}
        className="mr-2"
      >
        <ClipboardList className="h-4 w-4 mr-2" />
        Gerenciar Cotações
      </Button>
      
      <QuoteManager 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        requestId={requestId} 
        quotes={quotes || []}
      />
    </>
  );
};

export default ManageQuotesButton;
