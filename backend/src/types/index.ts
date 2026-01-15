// Type definitions for Nubebe Backend API

export interface RiskMetrics {
  largeTransactionCount: number;
  crossBorderCount: number;
  suspiciousCryptoCount: number;
  brokenFlowCount: number;
  totalRiskScore: number;
}

export interface EventFilters {
  clientId?: string;
  eventType?: string;
  assetClass?: string;
  complianceStatus?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  legalStructure?: string;
  jurisdictionType?: string;
  verificationStatus?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
}
