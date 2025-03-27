
import { 
  getAllRequests, 
  getRequestById, 
  createRequest, 
  updateRequestStatus 
} from '@/utils/database';

// Fetch all requests
export const fetchRequests = async () => {
  try {
    const requests = await getAllRequests();
    return requests;
  } catch (error) {
    console.error('Error fetching requests:', error);
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
    throw error;
  }
};

// Create new request
export const createNewRequest = async (requestData: any, items: any[]) => {
  try {
    const requestId = await createRequest(requestData, items);
    return requestId;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

// Update request status
export const updateStatus = async (id: number, status: string, approvalData?: any) => {
  try {
    const success = await updateRequestStatus(id, status, approvalData);
    return success;
  } catch (error) {
    console.error(`Error updating request ${id} status:`, error);
    throw error;
  }
};
