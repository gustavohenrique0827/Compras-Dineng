
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
