
import { createQuote, updateQuoteStatus } from '@/utils/database';

// Create new quote
export const createNewQuote = async (quoteData: any) => {
  try {
    const result = await createQuote(quoteData);
    return result;
  } catch (error) {
    console.error('Error creating quote:', error);
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
    throw error;
  }
};

// Get quotes for a request
export const getQuotesForRequest = async (requestId: number) => {
  // Mock implementation
  return [
    {
      id: 101,
      code: 'CC-3308',
      title: 'Reparo de moto',
      date: '2023-06-15',
      status: 'pending',
      totalValue: 550
    }
  ];
};
