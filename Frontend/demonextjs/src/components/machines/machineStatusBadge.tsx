'use client';
import { MachineStatus,MACHINE_STATUS_CONFIG,MachineStatusBadgeProps, Machine } from "@/types";
import {Tag} from 'antd';
import {cn} from "@/lib/utils";
export function MachineStatusBadge({status,className}:MachineStatusBadgeProps){
    const config=MACHINE_STATUS_CONFIG[status];
    return (
        <Tag
        color={config.chartColor}
        className={cn('font-medium',className)}
        >
            {config.label}
        </Tag>
    );
}
export default MachineStatusBadge;