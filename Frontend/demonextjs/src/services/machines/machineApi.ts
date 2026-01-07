import { getAllMachines } from './getAllMachines';
import { getMachineById } from './getMachineById';
import { createMachine } from './createMachine';
import { updateMachine } from './updateMachine';
import { deleteMachine } from './deleteMachine';

export const machinesApi = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};

export default machinesApi;
