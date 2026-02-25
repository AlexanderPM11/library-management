import axiosInstance from '../axiosInstance';
import { handleApiRequest, WrappedResponse, handleAuthRequest } from '../apiWrapper';
import { UserDto, CreateUserDto, UpdateUserDto, ApiResponse, AuthResponse } from '../types';

export const userService = {
    getAll: async (): Promise<WrappedResponse<UserDto[]>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<UserDto[]>>('/users'));
    },
    getById: async (id: string): Promise<WrappedResponse<UserDto>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<UserDto>>(`/users/${id}`));
    },
    create: async (user: CreateUserDto): Promise<WrappedResponse<AuthResponse>> => {
        return handleAuthRequest(axiosInstance.post<AuthResponse>('/users', user));
    },
    update: async (id: string, user: UpdateUserDto): Promise<WrappedResponse<AuthResponse>> => {
        return handleAuthRequest(axiosInstance.put<AuthResponse>(`/users/${id}`, user));
    }
};
