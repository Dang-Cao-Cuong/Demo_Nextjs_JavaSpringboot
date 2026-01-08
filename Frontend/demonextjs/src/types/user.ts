// User.ts
export interface User {
    id: string;
    username: string;
    fullname: string;
    email: string;
    roles: string[];
    createdAt?: string;
    updatedAt?: string;
}

// UserCreateRequest.ts
export interface UserCreateRequest {
    username: string;
    password: string;
    fullname: string;
    email: string;
    roles: string[];
}

// UserUpdateRequest.ts
export interface UserUpdateRequest {
    password?: string;
    fullname: string;
    email: string;
    roles: string[];
}
