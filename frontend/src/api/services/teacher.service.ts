import { ApiService } from './api.service';

export interface TeacherDetails {
  identifier?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  address1: string;
  address2?: string;
  pincode: string;
  state: string;
  country: string;
  adharNo: string;
}

export const teacherService = {
  saveTeacher: async (data: TeacherDetails) => {
    return ApiService.getInstance().post('/teacher-details/save', data);
  },
  
  updateTeacher: async (data: TeacherDetails) => {
    return ApiService.getInstance().put('/teacher-details/update', data);
  },

  getTeacherList: async () => {
    return ApiService.getInstance().get('/teacher-details/list');
  },

  getTeacherDetails: async (identifier: number) => {
    return ApiService.getInstance().get(`/teacher-details/${identifier}`);
  },

  deleteTeacher: async (identifier: number) => {
    return ApiService.getInstance().delete(`/teacher-details/${identifier}`);
  }
  ,

  getAssignments: async (teacherIdentifier: number) => {
    return ApiService.getInstance().get(`/teacher-details/${teacherIdentifier}/assignments`);
  },

  saveAssignments: async (teacherIdentifier: number, data: Array<{gradeIdentifier?: number, sectionIdentifier?: number}>) => {
    const payload = (data || []).map(d => ({
      gradeIdentifier: (d as any).gradeIdentifier ?? (d as any).gradeIdentifier ?? null,
      sectionIdentifier: d.sectionIdentifier ?? null
    }));
    return ApiService.getInstance().post(`/teacher-details/${teacherIdentifier}/assignments`, payload);
  }
};