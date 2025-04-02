
import { 
  getAllRequests, 
  getRequestById, 
  createRequest, 
  updateRequestStatus 
} from '@/utils/database';
import { toast } from 'sonner';

// Fetch all requests
export const fetchRequests = async () => {
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
