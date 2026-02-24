import axiosInstance from '../axiosInstance';
import { ApiResponse, Book, BookCreateDto } from '../types';
import { handleApiRequest, WrappedResponse } from '../apiWrapper';

export const bookService = {
    getAll: async (page = 1, pageSize = 10): Promise<WrappedResponse<Book[]>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<Book[]>>(`/books?page=${page}&pageSize=${pageSize}`));
    },
    getById: async (id: number): Promise<WrappedResponse<Book>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<Book>>(`/books/${id}`));
    },
    create: async (book: BookCreateDto): Promise<WrappedResponse<Book>> => {
        return handleApiRequest(axiosInstance.post<ApiResponse<Book>>('/books', book));
    },
    update: async (id: number, book: BookCreateDto): Promise<WrappedResponse<boolean>> => {
        return handleApiRequest(axiosInstance.put<ApiResponse<boolean>>(`/books/${id}`, book));
    },
    delete: async (id: number): Promise<WrappedResponse<boolean>> => {
        return handleApiRequest(axiosInstance.delete<ApiResponse<boolean>>(`/books/${id}`));
    },
};
