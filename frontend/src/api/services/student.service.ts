import { ApiService } from './api.service';

export interface StudentDetails {
  identifier?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  gradeIdentifier?: number | null;
  sectionIdentifier?: number | null;
  lecture: string;
  address1: string;
  address2?: string;
  pincode: string;
  state: string;
  country: string;
  adharNo: string;
}

export const studentService = {
  saveStudent: async (data: StudentDetails): Promise<number> => {
    return ApiService.getInstance().post('/student-details/save', data);
  },
  
  updateStudent: async (data: StudentDetails): Promise<number> => {
    return ApiService.getInstance().put('/student-details/update', data);
  },

  getStudentList: async (): Promise<StudentDetails[]> => {
    return ApiService.getInstance().get('/student-details/list');
  },

  getStudentDetails: async (identifier: number): Promise<StudentDetails> => {
    return ApiService.getInstance().get(`/student-details/${identifier}`);
  },

  deleteStudent: async (identifier: number): Promise<string> => {
    return ApiService.getInstance().delete(`/student-details/${identifier}`);
  }
};