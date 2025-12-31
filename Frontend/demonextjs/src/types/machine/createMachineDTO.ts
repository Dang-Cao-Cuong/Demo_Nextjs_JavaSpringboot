import { MachineStatus } from "./machineStatus";

export interface CreateMachineDTO{
    name:string;
    model:string;
    manufacturer_year:number;
    location:string;
    status?:MachineStatus;
}