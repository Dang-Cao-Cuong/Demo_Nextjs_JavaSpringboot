'use client';

import { useTranslation } from 'react-i18next';
import { Tag } from 'antd';
import { cn } from "@/lib/utils";
import { MachineStatus, MACHINE_STATUS_CONFIG, MachineStatusBadgeProps } from "@/types";

export function MachineStatusBadge({ status, className }: MachineStatusBadgeProps) {
    const { t } = useTranslation();
    const config = MACHINE_STATUS_CONFIG[status] || MACHINE_STATUS_CONFIG.INACTIVE;

    return (
        <Tag
            color={config.chartColor}
            className={cn('font-medium', className)}
            style={{ marginRight: 0 }}
        >
            {t(`machine.label.status.${status}`)}
        </Tag>
    );
}

export default MachineStatusBadge;