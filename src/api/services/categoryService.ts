import axiosInstance from '../axiosInstance';
import { ApiResponse, Category, CategoryCreateDto } from '../types';
import { handleApiRequest, WrappedResponse } from '../apiWrapper';

export const categoryService = {
    getAll: async (): Promise<WrappedResponse<Category[]>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<Category[]>>('/categories'));
    },
    create: async (category: CategoryCreateDto): Promise<WrappedResponse<Category>> => {
        return handleApiRequest(axiosInstance.post<ApiResponse<Category>>('/categories', category));
    },
    update: async (id: number, category: CategoryCreateDto): Promise<WrappedResponse<boolean>> => {
        return handleApiRequest(axiosInstance.put<ApiResponse<boolean>>(`/categories/${id}`, category));
    },
    delete: async (id: number): Promise<WrappedResponse<boolean>> => {
        return handleApiRequest(axiosInstance.delete<ApiResponse<boolean>>(`/categories/${id}`));
    },
};
