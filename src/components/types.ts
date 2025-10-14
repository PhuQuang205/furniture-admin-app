
export interface Role {
    id: number;
    name: string;
    description: string;
}


export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    enabled: boolean;
    roles: Role[];
}


export interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    avatarFile?: File;
    avatarUrl?: string;
    roleIds: number[]; // nhiều role
    enabled: boolean;
}


export interface UserRequest {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    avatarFile?: File;
    avatarUrl?: string;
    enabled: boolean;
    roleIds: number[];
}
