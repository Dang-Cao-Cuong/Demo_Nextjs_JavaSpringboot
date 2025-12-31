import { MachineStatus } from "./machineStatus";

export interface Machine {
    id: string;
    name: string;
    model: string;
    manufacture_year: number;
    location: string;
    status: MachineStatus;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;

}