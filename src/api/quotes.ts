
import { createQuote, updateQuoteStatus } from '@/utils/database';

// Define Quote interface to match the components
export interface Quote {
  id: number;
  code: string;
  title: string;
  date: string;
  status: string;
  totalValue: number;
  items?: Array<{
    itemId: number;
    supplierId: number;
    supplierName: string;
    itemName: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
    selected: boolean;
  }>;
}

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
export const getQuotesForRequest = async (requestId: number): Promise<Quote[]> => {
  console.log(`Fetching quotes for request ${requestId}`);
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

// Get quote details by ID
export const getQuoteById = async (quoteId: number): Promise<Quote> => {
  console.log(`Fetching quote details for ID ${quoteId}`);
  // Mock implementation
  return {
    id: quoteId,
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
  };
};
