import { Machine } from "./machine";

export interface MachineResponse{
    data:Machine[];
    meta:{
        total:number;
        page:number;
        limit:number;
        totalPage:number;
    };
}