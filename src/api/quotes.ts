
import { createQuote, updateQuoteStatus } from '@/utils/database';
import { toast } from 'sonner';

interface QuoteItem {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
  supplierId: number;
}

interface QuoteData {
  requestId: number;
  items: QuoteItem[];
  status?: string;
  totalValue?: number;
  approvedBy?: string;
  approvalLevel?: string;
}

// Create new quote
export const createNewQuote = async (quoteData: QuoteData) => {
  try {
    const result = await createQuote(quoteData);
    return result;
  } catch (error) {
    console.error('Error creating quote:', error);
    toast.error('Erro ao criar cotação');
    throw error;
  }
};

// Update quote status
export const updateQuote = async (id: number, status: string, approvedBy?: string, approvalLevel?: string) => {
  try {
    const result = await updateQuoteStatus(id, status, approvedBy, approvalLevel);
    return result;
  } catch (error) {
    console.error(`Error updating quote ${id}:`, error);
    toast.error('Erro ao atualizar cotação');
    throw error;
  }
};

// Finalize quote with selected items
export const finalizeQuote = async (requestId: number, selectedItems: QuoteItem[]) => {
  try {
    // In a real application, this would call an API endpoint to save the selected items
    console.log('Finalizing quote for request', requestId, 'with items:', selectedItems);
    
    // Calculate total
    const totalValue = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Group items by supplier for better reporting
    const supplierGroups = selectedItems.reduce((groups: Record<number, QuoteItem[]>, item) => {
      if (!groups[item.supplierId]) {
        groups[item.supplierId] = [];
      }
      groups[item.supplierId].push(item);
      return groups;
    }, {});
    
    console.log('Items grouped by supplier:', supplierGroups);
    console.log('Total value:', totalValue);
    
    // Mock successful response
    return {
      success: true,
      requestId,
      totalValue,
      supplierGroups,
      message: 'Quote finalized successfully'
    };
  } catch (error) {
    console.error(`Error finalizing quote for request ${requestId}:`, error);
    toast.error('Erro ao finalizar cotação');
    throw error;
  }
};
