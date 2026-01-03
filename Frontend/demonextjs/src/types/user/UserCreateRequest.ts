export interface UserCreateRequest {
  username: string;
  password: string;
  fullname: string;
  email: string;
  roles: string[];
}