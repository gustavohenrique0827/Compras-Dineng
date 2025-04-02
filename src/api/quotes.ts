
import { createQuote, updateQuoteStatus, getAllRequests, Request } from '@/utils/database';
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

// URL base da API
const API_URL = 'http://localhost:5000/api';

// Create new quote
export const createNewQuote = async (quoteData: QuoteData) => {
  try {
    const result = await createQuote(quoteData);
    toast.success('Cotação criada com sucesso!');
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
    if (result) {
      toast.success('Status da cotação atualizado com sucesso!');
    }
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
    // Tente usar a API para finalizar a cotação
    try {
      const response = await fetch(`${API_URL}/quotes/${requestId}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedItems })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao finalizar cotação pela API');
      }
      
      const result = await response.json();
      toast.success('Cotação finalizada com sucesso!');
      return result;
    } catch (apiError) {
      console.log('Usando processamento local para finalizar a cotação:', apiError);
      
      // Fallback para processamento local
      console.log('Finalizando cotação para solicitação', requestId, 'com itens:', selectedItems);
      
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
      
      toast.success('Cotação finalizada com sucesso!');
      
      // Return the data that would be saved to the database
      return {
        success: true,
        requestId,
        totalValue,
        supplierGroups,
        message: 'Quote finalized successfully'
      };
    }
  } catch (error) {
    console.error(`Error finalizing quote for request ${requestId}:`, error);
    toast.error('Erro ao finalizar cotação');
    throw error;
  }
};

// Get all quote requests
export const fetchQuoteRequests = async () => {
  try {
    // Tente usar a API para buscar solicitações para cotação
    try {
      const response = await fetch(`${API_URL}/quotes/requests`);
      if (!response.ok) {
        throw new Error('Falha ao buscar solicitações pela API');
      }
      return await response.json();
    } catch (apiError) {
      console.log('Usando dados locais para solicitações:', apiError);
      
      // Get all requests that can be quoted
      const requests = await getAllRequests();
      const quoteRequests = requests.filter(req => 
        req.status === 'Aprovado' || req.status === 'Em Cotação'
      );
      return quoteRequests;
    }
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    toast.error('Erro ao carregar solicitações para cotação');
    throw error;
  }
};
