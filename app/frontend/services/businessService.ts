import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7013/api';

export interface Business {
  id: number;
  name: string;
  category: string;
  owner: string;
  location: string;
  status: string;
  registrationDate: string;
  verified: boolean;
}

export interface CreateBusinessRequest {
  name: string;
  category: string;
  owner: string;
  location: string;
  verified: boolean;
}

export interface UpdateBusinessRequest {
  name: string;
  category: string;
  owner: string;
  location: string;
  status: string;
  verified: boolean;
}

export const businessService = {
  getAllBusinesses: async (): Promise<Business[]> => {
    const response = await axios.get(`${API_BASE_URL}/businesses`);
    return response.data;
  },

  getBusinessById: async (id: number): Promise<Business> => {
    const response = await axios.get(`${API_BASE_URL}/businesses/${id}`);
    return response.data;
  },

  createBusiness: async (business: CreateBusinessRequest): Promise<Business> => {
    const response = await axios.post(`${API_BASE_URL}/businesses`, business);
    return response.data;
  },

  updateBusiness: async (id: number, business: UpdateBusinessRequest): Promise<void> => {
    await axios.put(`${API_BASE_URL}/businesses/${id}`, business);
  },

  deleteBusiness: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/businesses/${id}`);
  },
}; 