import axiosInstance from '../axiosInstance';
import { handleApiRequest, WrappedResponse } from '../apiWrapper';
import { ApiResponse, EmailTemplateDto, CreateEmailTemplateDto, UpdateEmailTemplateDto, PreviewRequestDto } from '../types';

export const emailTemplatesService = {
    getAll: async (): Promise<WrappedResponse<EmailTemplateDto[]>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<EmailTemplateDto[]>>('/emailtemplates'));
    },

    getById: async (id: number): Promise<WrappedResponse<EmailTemplateDto>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<EmailTemplateDto>>(`/emailtemplates/${id}`));
    },

    create: async (data: CreateEmailTemplateDto): Promise<WrappedResponse<EmailTemplateDto>> => {
        return handleApiRequest(axiosInstance.post<ApiResponse<EmailTemplateDto>>('/emailtemplates', data));
    },

    update: async (id: number, data: UpdateEmailTemplateDto): Promise<WrappedResponse<void>> => {
        // Here we just return void but wait for the API
        const promise = axiosInstance.put<ApiResponse<any>>(`/emailtemplates/${id}`, data);
        return handleApiRequest(promise) as any;
    },

    delete: async (id: number): Promise<WrappedResponse<void>> => {
        const promise = axiosInstance.delete<ApiResponse<any>>(`/emailtemplates/${id}`);
        return handleApiRequest(promise) as any;
    },

    preview: async (data: PreviewRequestDto): Promise<WrappedResponse<{ html: string }>> => {
        // Assuming preview returns just the HTML string or an object with HTML string in `data` inside `ApiResponse`
        // Wait, the API returns Ok(new { html }) which is NOT ApiResponse. It's just `{ html: "..." }`.
        // I need to use axiosInstance directly.
        try {
            const response = await axiosInstance.post<{ html: string }>('/emailtemplates/preview', data);
            return { data: response.data, error: null, errors: null };
        } catch (error: any) {
            return { data: null, error: error.response?.data?.message || 'Error executing preview', errors: null };
        }
    }
};
