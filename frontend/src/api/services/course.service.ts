import { ApiService } from './api.service';

export interface SectionDetails {
  identifier?: number;
  name?: string;
}

export interface CourseDetails {
  identifier?: number;
  course: string;
  description?: string;
  sections?: SectionDetails[];
}

export const courseService = {
  save: async (data: CourseDetails) => {
    return ApiService.getInstance().post<number>('/course/save', data);
  },

  update: async (data: CourseDetails) => {
    return ApiService.getInstance().put<number>('/course/update', data);
  },

  list: async (): Promise<CourseDetails[]> => {
    return ApiService.getInstance().get<CourseDetails[]>('/course/list');
  },

  details: async (identifier: number): Promise<CourseDetails> => {
    return ApiService.getInstance().get<CourseDetails>(`/course/${identifier}`);
  },

  delete: async (identifier: number): Promise<string> => {
    return ApiService.getInstance().delete<string>(`/course/${identifier}`);
  }
};
