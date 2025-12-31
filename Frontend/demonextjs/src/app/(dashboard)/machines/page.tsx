'use client';
import{ useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import{ useDebounce }    from 'use-debounce';
import{Button as AntButton,Card as AntCard} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {MachineTable} from "@/components/machines/machineTable"
import { MachineFilter } from '@/components/machines/machineFilter';
import {Pagination} from "@/components/common/Pagination"
import { MachineStatus ,MachineFilter as machineFilterType} from '@/types';
import { useMachines } from '@/hooks/useMachine';
export default function MachinesPage(){
const [search,setSearch]= useState('');
const[status,setStatus]=useState<MachineStatus |'all'>('all');
const [page,setPage]= useState(1);
const[pagesize,setPageSize]=useState(10);
const [sortBy,setSortBy]=useState<string>('created_at');
const[sortOrder,setSortOrder]=useState<'asc'|'dec'>('dec');
const [debounceSearch]=useDebounce(search,300);
const filter:machineFilterType= useMemo(
    ()=>({
        search:debounceSearch,
        status :status==='all'?undefined:status,
        page,
        limit:pagesize,
        sortBy,
        sortOrder,
    }),
    [debounceSearch,status,page,pagesize,sortBy,sortOrder]
);
const {data,isLoading}= useMachines(filter);
const handleSoft= useCallback(
    (field:string)=>{
        if(sortBy==field){
            setSortOrder(sortOrder==='asc'?'dec':'asc');
        }else{
            setSortBy(field);
            setSortOrder('asc');
        }
    },
    [sortBy,sortOrder]
);
const handleClearFilter=()=>{
    setSearch('');
    setStatus('all');
    setPage(1);
}
 const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };
  return(
    <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row justify-between gap-4'>
            <div >
                <h1 className='text-3x1 font-bold text-gray-900 dark:text-white'>
                    Danh sách máy CNC
                </h1>
                <p className='text-gray-600 dark:text-gray-40 mt-1'>
                    Quản lý tất cả máy CNC trong hệ thống 
                </p>
            </div>
            <Link href={'/machine/create'}>
            <AntButton type='primary' icon={<PlusOutlined/>} size='large'>
            Thêm máy mới 
            </AntButton>
            </Link>
        </div>
        <AntCard >
            <div className='space-y-6'>
                <MachineFilter
                search={search}
                status={status}
                onSearchChange={(value)=>{
                    setSearch(value);
                    setPage(1);
                }}
                onStatusChange={(value)=>{
                    setStatus(value);
                    setPage(1);
                }}
                onClear={handleClearFilter}
                />
                <MachineTable
                machines={data?.data||[]}
                isLoading={isLoading}
                onSort={handleSoft}
                sortBy={sortBy}
                sortOrder={sortOrder}/>
                {data && data.meta.totalPage>0&&(
                    <Pagination
                    currentPage={data.meta.page}
                    totalPages={data.meta.totalPage}
                    totalItems={data.meta.total}
                    pageSize={pagesize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}/>

                )}
            </div>
        </AntCard>
    </div>
  );
}
