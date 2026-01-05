import { TokenResponse } from "./TokenResponse";
export interface BackendResponse {
  code: number;
  message?: string;
  result?: TokenResponse;
}