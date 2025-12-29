import {User} from'./index'
export interface AuthResponse {
  user: User;
  token: string;
}