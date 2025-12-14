import { ApiService } from './api.service';

export class DataService {
  private static instance: DataService;
  private api = ApiService.getInstance();

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Generic CRUD operations
  async getAll<T>(endpoint: string): Promise<T[]> {
    return this.api.get<T[]>(`/${endpoint}`);
  }

  async getById<T>(endpoint: string, id: string | number): Promise<T> {
    return this.api.get<T>(`/${endpoint}/${id}`);
  }

  async create<T>(endpoint: string, data: Partial<T>): Promise<T> {
    return this.api.post<T>(`/${endpoint}`, data);
  }

  async update<T>(endpoint: string, id: string | number, data: Partial<T>): Promise<T> {
    return this.api.put<T>(`/${endpoint}/${id}`, data);
  }

  async delete(endpoint: string, id: string | number): Promise<void> {
    return this.api.delete<void>(`/${endpoint}/${id}`);
  }

  async query<T>(endpoint: string, params: Record<string, any> = {}): Promise<T[]> {
    const queryString = this.api.buildQueryString(params);
    return this.api.get<T[]>(`/${endpoint}${queryString}`);
  }

  // Specialized query methods
  async queryStats<T>(type: 'orgadmin' | 'teacher' | 'student'): Promise<T[]> {
    return this.query<T>('stats', { type });
  }
}