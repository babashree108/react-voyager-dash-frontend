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
    // Backend uses explicit /list routes for collections (e.g. /student-details/list)
    try {
      const res = await this.api.get<T[]>(`/${endpoint}/list`);
      // Ensure we always return an array
      return Array.isArray(res) ? res : [];
    } catch (err) {
      // On error return empty array to avoid runtime .map errors in UI
      // eslint-disable-next-line no-console
      console.warn(`DataService.getAll failed for ${endpoint}:`, err);
      return [];
    }
  }

  async getById<T>(endpoint: string, id: string | number): Promise<T> {
    return this.api.get<T>(`/${endpoint}/${id}`);
  }

  async create<T>(endpoint: string, data: Partial<T>): Promise<T> {
    // Backend create endpoints use the /save route (e.g. /student-details/save)
    return this.api.post<T>(`/${endpoint}/save`, data);
  }

  async update<T>(endpoint: string, id: string | number, data: Partial<T>): Promise<T> {
    // Backend update endpoints use the /update route
    return this.api.put<T>(`/${endpoint}/update`, data);
  }

  async delete(endpoint: string, id: string | number): Promise<void> {
    return this.api.delete<void>(`/${endpoint}/${id}`);
  }

  async query<T>(endpoint: string, params: Record<string, any> = {}): Promise<T[]> {
    const queryString = this.api.buildQueryString(params);
    return this.api.get<T[]>(`/${endpoint}${queryString}`);
  }

  // Specialized query methods
  // Backend exposes stats as /stats/{type} (e.g. /stats/teacher). Call that route
  // instead of using a query param which may return a different shape.
  async queryStats<T>(type: 'orgadmin' | 'teacher' | 'student'): Promise<T[]> {
    try {
      const res = await this.api.get<T[]>(`/stats/${type}`);
      return Array.isArray(res) ? res : [];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`DataService.queryStats failed for ${type}:`, err);
      return [];
    }
  }
}