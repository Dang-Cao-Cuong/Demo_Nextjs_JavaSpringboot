export interface UserUpdateRequest {
  password?: string;
  fullname: string;
  email: string;
  roles: string[];
}