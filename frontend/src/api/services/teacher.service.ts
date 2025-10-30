import { ApiService } from './api.service';

export interface TeacherDetails {
  identifier?: number;
  fName: string;
  lName: string;
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
};