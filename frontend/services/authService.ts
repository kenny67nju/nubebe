// Authentication API Service
import { httpClient, ApiResponse } from '../utils/httpClient';
import { STORAGE_KEYS } from '../config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ADVISOR' | 'CLIENT' | 'AUDITOR';
  createdAt?: string;
  updatedAt?: string;
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

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>('/auth/register', data, false);

    if (response.success && response.data) {
      this.saveAuthData(response.data);
    }

    return response;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials, false);

    if (response.success && response.data) {
      this.saveAuthData(response.data);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return await httpClient.get<User>('/auth/profile');
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private saveAuthData(authData: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));
  }
}

export default new AuthService();
