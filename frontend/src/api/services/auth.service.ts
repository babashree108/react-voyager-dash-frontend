import { ApiService } from './api.service';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    organization?: string | null;
    avatarUrl?: string | null;
  };
};

class AuthService {
  private api = ApiService.getInstance();

  async login(payload: LoginRequest): Promise<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', payload);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
