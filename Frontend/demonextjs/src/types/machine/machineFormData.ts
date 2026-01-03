import { Machine } from "./machine";
import { MachineStatus } from "./machineStatus";

export interface MachineFormData {
  name: string;
  model: string;
  manufactureYear: number;
  location: string;
  status: MachineStatus;
}

export interface MachineFormProps {
  machine?: Machine;
  onSubmit: (data: MachineFormData) => void;
  isLoading?: boolean;
}