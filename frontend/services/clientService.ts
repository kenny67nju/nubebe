// Client API Service
import { httpClient, ApiResponse } from '../utils/httpClient';

export interface Client {
  id: string;
  clientCode: string;
  fullName: string;
  email?: string;
  phone?: string;
  nationality: string[];
  taxResidency: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  onboardingDate: string;
  createdAt: string;
  updatedAt: string;
  advisor?: {
    name: string;
    email: string;
  };
}

export interface ClientStats {
  totalAssets: number;
  totalEvents: number;
  bioEvents: number;
  entities: number;
  assetsByClass: Record<string, number>;
  assetsByJurisdiction: Record<string, number>;
}

export interface CreateClientData {
  clientCode: string;
  fullName: string;
  email?: string;
  phone?: string;
  nationality: string[];
  taxResidency: string[];
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  advisorId: string;
}

class ClientService {
  async getClients(advisorId?: string): Promise<ApiResponse<Client[]>> {
    const queryString = advisorId ? `?advisorId=${advisorId}` : '';
    return await httpClient.get<Client[]>(`/clients${queryString}`);
  }

  async getClientById(clientId: string): Promise<ApiResponse<Client>> {
    return await httpClient.get<Client>(`/clients/${clientId}`);
  }

  async createClient(clientData: CreateClientData): Promise<ApiResponse<Client>> {
    return await httpClient.post<Client>('/clients', clientData);
  }

  async updateClient(clientId: string, clientData: Partial<CreateClientData>): Promise<ApiResponse<Client>> {
    return await httpClient.put<Client>(`/clients/${clientId}`, clientData);
  }

  async deleteClient(clientId: string): Promise<ApiResponse<void>> {
    return await httpClient.delete<void>(`/clients/${clientId}`);
  }

  async getClientStats(clientId: string): Promise<ApiResponse<ClientStats>> {
    return await httpClient.get<ClientStats>(`/clients/${clientId}/stats`);
  }
}

export default new ClientService();
