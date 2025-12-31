import { MachineStatus } from "./machineStatus";

export interface MachineFilter{
    search?:string;
    status?:MachineStatus|"all";
    location?:string;
    page?:number;
    limit?:number;
    sortBy?:string;
    sortOrder?:'asc'|   'dec';
}
export interface MachineFilterProps{
    search:string;
    status?:MachineStatus|"all";
    onSearchChange:(value:string)=>void;
    onStatusChange:(value:MachineStatus|"all")=>void;
    onClear:()=>void;
}