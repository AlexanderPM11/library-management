export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string[];
}

export interface UserRegisterDto {
    email: string;
    password?: string;
    confirmPassword?: string;
    firstName: string;
    lastName: string;
}

export interface UserLoginDto {
    email: string;
    password?: string;
}

export interface AuthResponse {
    isSuccess: boolean;
    token: string;
    message: string;
    errors: string[];
}

export interface Book {
    id: number;
    title: string;
    isbn: string;
    description: string;
    publicationYear: number;
    stock: number;
    category: Category;
    authors: Author[];
}

export interface BookCreateDto {
    title: string;
    isbn: string;
    description: string;
    publicationYear: number;
    stock: number;
    categoryId: number;
    authorIds: number[];
}

export interface Author {
    id: number;
    firstName: string;
    lastName: string;
    biography: string;
}

export interface AuthorCreateDto {
    firstName: string;
    lastName: string;
    biography: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface CategoryCreateDto {
    name: string;
    description: string;
}

export interface User {
    email: string;
    role: 'Admin' | 'User';
}

export interface RecentActivity {
    title: string;
    message: string;
    createdAt: string;
    updatedAt?: string;
}

export enum AuditType {
    None = 0,
    Create = 1,
    Update = 2,
    Delete = 3
}

export interface AuditLog {
    id: number;
    userId: string | null;
    userName?: string | null;
    type: AuditType;
    typeName: string;
    tableName: string;
    dateTime: string;
    oldValues: string | null;
    newValues: string | null;
    affectedColumns: string | null;
    primaryKey: string;
}

export interface DashboardStats {
    totalBooks: number;
    totalAuthors: number;
    totalCategories: number;
    recentActivities: RecentActivity[];
}

