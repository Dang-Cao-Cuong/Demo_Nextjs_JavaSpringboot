import {User } from "./index"
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}