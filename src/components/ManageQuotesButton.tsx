
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import QuoteManager from './QuoteManager';

interface ManageQuotesButtonProps {
  requestId: number;
  status: string;
}

const ManageQuotesButton = ({ requestId, status }: ManageQuotesButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
      />
    </>
  );
};

export default ManageQuotesButton;
