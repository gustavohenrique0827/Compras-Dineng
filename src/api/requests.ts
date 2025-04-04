
import { 
  getAllRequests, 
  getRequestById, 
  createRequest, 
  updateRequestStatus,
  updateRequestDetails,
  Request
} from '@/utils/database';
import { toast } from 'sonner';
import { fetchQuotesByRequestId } from './quotes';

// Fetch all requests
export const fetchRequests = async (): Promise<Request[]> => {
  try {
    const requests = await getAllRequests();
    return requests;
  } catch (error) {
    console.error('Error fetching requests:', error);
    toast.error('Erro ao carregar solicitações');
    throw error;
  }
};

// Fetch request by ID
export const fetchRequestById = async (id: number) => {
  try {
    const request = await getRequestById(id);
    return request;
  } catch (error) {
    console.error(`Error fetching request with ID ${id}:`, error);
    toast.error('Erro ao carregar detalhes da solicitação');
    throw error;
  }
};

// Create new request
export const createNewRequest = async (requestData: any, items: any[]) => {
  try {
    const requestId = await createRequest(requestData, items);
    toast.success('Solicitação criada com sucesso!');
    return requestId;
  } catch (error) {
    console.error('Error creating request:', error);
    toast.error('Erro ao criar solicitação');
    throw error;
  }
};

// Update request status
export const updateStatus = async (id: number, status: string, approvalData?: any) => {
  try {
    // Certifique-se de que nivel_aprovacao seja numérico para o banco de dados
    if (approvalData && typeof approvalData.nivel_aprovacao === 'string') {
      // Mapeamento de níveis de aprovação de string para número
      const nivelMap: {[key: string]: number} = {
        'Supervisão': 1,
        'Gerência': 2,
        'Diretoria': 3,
        'Presidente': 4
      };
      
      approvalData.nivel_aprovacao = nivelMap[approvalData.nivel_aprovacao] || 1;
    }
    
    const success = await updateRequestStatus(id, status, approvalData);
    if (success) {
      toast.success('Status da solicitação atualizado com sucesso!');
    }
    return success;
  } catch (error) {
    console.error(`Error updating request ${id} status:`, error);
    toast.error('Erro ao atualizar status da solicitação');
    throw error;
  }
};

// Update request details
export const updateRequest = async (id: number, requestData: Partial<Request>) => {
  try {
    const success = await updateRequestDetails(id, requestData);
    if (success) {
      toast.success('Detalhes da solicitação atualizados com sucesso!');
    }
    return success;
  } catch (error) {
    console.error(`Error updating request ${id}:`, error);
    toast.error('Erro ao atualizar detalhes da solicitação');
    throw error;
  }
};

// Get quotes for request
export const getQuotesForRequest = async (requestId: number) => {
  try {
    const quotes = await fetchQuotesByRequestId(requestId);
    return quotes;
  } catch (error) {
    console.error(`Error fetching quotes for request ${requestId}:`, error);
    toast.error('Erro ao carregar cotações para a solicitação');
    throw error;
  }
};
