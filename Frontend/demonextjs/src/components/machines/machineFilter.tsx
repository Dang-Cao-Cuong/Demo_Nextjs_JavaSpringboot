'use client';
import { Input, Select, Space, Button as AntButton } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { MachineStatus, MACHINE_STATUS_CONFIG, MachineFilterProps } from "@/types";
const { Search } = Input;
const stausOptions: { value: MachineStatus | 'all'; lable: string }[] = [
    { value: 'all', lable: 'Tất cả trạng thái' },
    ...Object.entries(MACHINE_STATUS_CONFIG).map(([key, config]) => ({
        value: key as MachineStatus,
        lable: config.label,
    })),
];
export function MachineFilter({
    search,
    status,
    onSearchChange,
    onStatusChange,
    onClear,
}: MachineFilterProps) {
    const hasFilter = search || status != 'all';
    return (
        <Space.Compact block size="large" className="flex-wrap gap-2">
            <div className="flex-1 min-w-[250px]">
                <Search
                    placeholder="tìm kiếm nội dung theo mã máy..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    size="large" />
            </div>
            <Select
                value={status}
                onChange={onStatusChange}
                options={stausOptions}
                style={{ width: 200 }}
                size="large"
            />
            {hasFilter && (
                <AntButton
                    icon={<ClearOutlined />}
                    onClick={onClear}
                    size="large">Xóa bộ lọc
                </AntButton>
            )}
        </Space.Compact>
    );
}
export default MachineFilter;