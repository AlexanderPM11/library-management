import axiosInstance from '../axiosInstance';
import { ApiResponse, Author, AuthorCreateDto } from '../types';
import { handleApiRequest, WrappedResponse } from '../apiWrapper';

export const authorService = {
    getAll: async (): Promise<WrappedResponse<Author[]>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<Author[]>>('/authors'));
    },
    create: async (author: AuthorCreateDto): Promise<WrappedResponse<Author>> => {
        return handleApiRequest(axiosInstance.post<ApiResponse<Author>>('/authors', author));
    },
    update: async (id: number, author: AuthorCreateDto): Promise<WrappedResponse<boolean>> => {
        return handleApiRequest(axiosInstance.put<ApiResponse<boolean>>(`/authors/${id}`, author));
    },
    delete: async (id: number): Promise<WrappedResponse<boolean>> => {
        return handleApiRequest(axiosInstance.delete<ApiResponse<boolean>>(`/authors/${id}`));
    },
};
