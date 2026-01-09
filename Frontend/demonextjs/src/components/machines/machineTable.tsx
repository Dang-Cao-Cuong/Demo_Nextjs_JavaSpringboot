'use client';
import { } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dropdown, MenuProps, TableColumnsType, Button as AntButton, Table, Empty, } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { MachineStatusBadge } from "./MachineStatusBadge";
import { Machine, MachineTableProps } from "@/types";

export function MachineTable({
    machines, isLoading,
    onSort,
    sortBy,
    sortOrder,
}: MachineTableProps) {
    const router = useRouter();
    const getMenuItems = (record: Machine): MenuProps['items'] => [
        {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
            onClick: () => router.push(`/machines/${record.id}`),
        },
        {
            key: 'edit',
            label: 'Chỉnh sửa ',
            icon: <EditOutlined />,
            onClick: () => router.push(`/machines/${record.id}/edit`),
        }, {
            type: 'divider',
        }, {
            key: 'delete',
            label: 'xóa',
            icon: <DeleteOutlined />,
            onClick: () => { },
        },
    ];
    const columns: TableColumnsType<Machine> = [
        {
            title: 'Tên máy  ',
            dataIndex: 'name',
            key: 'name',
            sorter: onSort ? true : false,
            render: (name: string, record: Machine) => (
                <Link
                    href={`/machines/${record.id}`}
                    className="font-medium hover:underline text-blue-500">
                    {name}
                </Link>

            ),
        },

        {
            title: 'model',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: 'Vị trí',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            key: 'status',
            render: (status: Machine['status']) => <MachineStatusBadge status={status} />
        }, {
            title: "Năm sản suất",
            dataIndex: "manufacture_year",
            key: "manufacture_year",
            sorter: onSort ? true : false,
            width: 100,
        }, {
            title: "",
            key: 'action',
            width: 80,
            render: (_: any, record: Machine) => (
                <Dropdown menu={{ items: getMenuItems(record) }} trigger={['click']}>
                    <AntButton type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];
    return (
        <Table
            columns={columns}
            dataSource={machines}
            rowKey={'id'}
            loading={isLoading}
            locale={{
                emptyText: <Empty description="Không có máy nào." />,
            }}
            pagination={false}
            bordered
            onChange={(pagination, filter, sorter) => {
                if (onSort && !Array.isArray(sorter) && sorter.field) {
                    onSort(sorter.field as string);
                }
            }}
        />
    );

}
export default MachineTable;