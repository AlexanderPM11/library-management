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

export interface UserProfileDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    roles: string[];
    branchId: number | null;
}

export interface UpdateProfileDto {
    firstName: string;
    lastName: string;
    currentPassword?: string;
    newPassword?: string;
}

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    roles: string[];
    isActive: boolean;
    branchId: number | null;
}

export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    role: string;
    isActive?: boolean;
    branchId?: number | null;
}

export interface UpdateUserDto {
    email?: string;
    firstName: string;
    lastName: string;
    password?: string;
    role?: string;
    isActive?: boolean;
    branchId?: number | null;
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
    branchId: number | null;
}

export interface BookCreateDto {
    title: string;
    isbn: string;
    description: string;
    publicationYear: number;
    stock: number;
    categoryId: number;
    authorIds: number[];
    branchId?: number | null;
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
    role: string;
    branchId: number | null;
}

export interface RecentActivity {
    title: string;
    message: string;
    type: string;
    date: string;
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
    branchId?: number | null;
}

export interface Branch {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    isActive: boolean;
}

export interface CategoryDistribution {
    categoryName: string;
    bookCount: number;
}

export interface DashboardStats {
    totalBooks: number;
    totalAuthors: number;
    totalCategories: number;
    recentActivities: RecentActivity[];
    booksByCategory: CategoryDistribution[];
}

export interface BranchBookCount {
    branchName: string;
    bookCount: number;
}

export interface SuperAdminStats {
    totalBranches: number;
    totalActiveUsers: number;
    totalSystemBooks: number;
    activeBranchesCount: number;
    topBranchesByBooks: BranchBookCount[];
    globalActivities: RecentActivity[];
}

export enum EmailTemplateType {
    Welcome = 1,
    PasswordReset = 2,
    EmailConfirmation = 3
}

export interface EmailTemplateDto {
    id: number;
    branchId: number | null;
    subject: string;
    htmlContent: string;
    type: EmailTemplateType;
    isActive: boolean;
}

export interface CreateEmailTemplateDto {
    branchId: number | null;
    subject: string;
    htmlContent: string;
    type: EmailTemplateType;
    isActive?: boolean;
}

export interface UpdateEmailTemplateDto {
    subject: string;
    htmlContent: string;
    type: EmailTemplateType;
    isActive: boolean;
}

export interface PreviewRequestDto {
    htmlContent: string;
    variables?: Record<string, string>;
}

