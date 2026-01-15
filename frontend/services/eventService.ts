// Event API Service
import { httpClient, ApiResponse } from '../utils/httpClient';
import { UnifiedEvent, RiskMetrics } from '../types';

export interface EventQueryParams {
  clientId?: string;
  eventType?: string;
  assetClass?: string;
  complianceStatus?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedEvents {
  events: UnifiedEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class EventService {
  async getEvents(params?: EventQueryParams): Promise<ApiResponse<PaginatedEvents>> {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';

    return await httpClient.get<PaginatedEvents>(`/events${queryString}`);
  }

  async getEventById(eventId: string): Promise<ApiResponse<UnifiedEvent>> {
    return await httpClient.get<UnifiedEvent>(`/events/${eventId}`);
  }

  async createEvent(eventData: Partial<UnifiedEvent>): Promise<ApiResponse<UnifiedEvent>> {
    return await httpClient.post<UnifiedEvent>('/events', eventData);
  }

  async updateEvent(eventId: string, eventData: Partial<UnifiedEvent>): Promise<ApiResponse<UnifiedEvent>> {
    return await httpClient.put<UnifiedEvent>(`/events/${eventId}`, eventData);
  }

  async deleteEvent(eventId: string): Promise<ApiResponse<void>> {
    return await httpClient.delete<void>(`/events/${eventId}`);
  }

  async getRiskMetrics(clientId?: string): Promise<ApiResponse<RiskMetrics>> {
    const queryString = clientId ? `?clientId=${clientId}` : '';
    return await httpClient.get<RiskMetrics>(`/events/risk-metrics${queryString}`);
  }

  async getFlowPath(eventId: string): Promise<ApiResponse<UnifiedEvent[]>> {
    return await httpClient.get<UnifiedEvent[]>(`/events/${eventId}/flow-path`);
  }

  async getClientEvents(clientId: string): Promise<ApiResponse<UnifiedEvent[]>> {
    return await httpClient.get<UnifiedEvent[]>(`/events/client/${clientId}`);
  }
}

export default new EventService();
