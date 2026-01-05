export interface MachineErrorNotification {
  machineId: string;
  machineName: string;
  message: string; // Backend gửi 'message' không phải 'errorMessage'
  timestamp: string; // ISO 8601 format
  
  // Optional fields (backend có thể không gửi)
  errorCode?: string;
  errorMessage?: string;
  status?: 'ERROR';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}