import { ApiService } from './api.service';

export interface SectionDetails {
  identifier?: number;
  name?: string;
}

export interface GradeDetails {
  identifier?: number;
  grade: string;
  description?: string;
  sections?: SectionDetails[];
}

export const gradeService = {
  save: async (data: GradeDetails) => {
    const payload = {
      identifier: data.identifier,
      grade: data.grade,
      description: data.description,
      sections: data.sections
    };
    return ApiService.getInstance().post<number>('/grade/save', payload);
  },

  update: async (data: GradeDetails) => {
    const payload = {
      identifier: data.identifier,
      grade: data.grade,
      description: data.description,
      sections: data.sections
    };
    return ApiService.getInstance().put<number>('/grade/update', payload);
  },

  list: async (): Promise<GradeDetails[]> => {
    const list = await ApiService.getInstance().get<any[]>('/grade/list');
    return (list || []).map(c => ({
      identifier: c.identifier,
      grade: c.grade,
      description: c.description,
      sections: c.sections
    }));
  },

  details: async (identifier: number): Promise<GradeDetails> => {
    const c = await ApiService.getInstance().get<any>(`/grade/${identifier}`);
    return {
      identifier: c.identifier,
      grade: c.grade,
      description: c.description,
      sections: c.sections
    };
  },

  delete: async (identifier: number): Promise<string> => {
    return ApiService.getInstance().delete<string>(`/grade/${identifier}`);
  }
};
