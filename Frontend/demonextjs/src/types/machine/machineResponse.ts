import { Machine } from "./machine";

export interface MachineResponse {
  content: Machine[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}