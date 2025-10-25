import { ApiService } from './api.service';

export interface SubjectDetails {
  identifier?: number;
  subject: string;
}

export const subjectService = {
  save: async (data: SubjectDetails | SubjectDetails[]) => {
    const payload = Array.isArray(data) ? data : [data];
    return ApiService.getInstance().post('/subject-details/save', payload);
  },
  
  // ✅ Update accepts a single object
  update: async (data: SubjectDetails) => {
    return ApiService.getInstance().put('/subject-details/update', data);
  },
  list: async () => {
    return ApiService.getInstance().get('/subject-details/list');
  },

  details: async (identifier: number) => {
    return ApiService.getInstance().get(`/subject-details/details/${identifier}`);
  },

  delete: async (identifier: number) => {
    return ApiService.getInstance().delete(`/subject-details/delete/${identifier}`);
  }
};