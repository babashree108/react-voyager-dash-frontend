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
		return ApiService.getInstance().post<number>('/grade/save', data);
	},

	update: async (data: GradeDetails) => {
		return ApiService.getInstance().put<number>('/grade/update', data);
	},

	list: async (): Promise<GradeDetails[]> => {
		return ApiService.getInstance().get<GradeDetails[]>('/grade/list');
	},

	details: async (identifier: number): Promise<GradeDetails> => {
		return ApiService.getInstance().get<GradeDetails>(`/grade/${identifier}`);
	},

	delete: async (identifier: number): Promise<string> => {
		return ApiService.getInstance().delete<string>(`/grade/${identifier}`);
	}
};
