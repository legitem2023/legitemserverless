'use client'
import Loading from '@/components/UI/Loading';
import Titlebar from '@/components/UI/Titlebar';
import React, { useEffect, useState } from 'react'
import { truncateString } from '../../../../utils/script';
import Accordion from '@/components/Accordion/Accordion';
import { Icon } from '@iconify/react/dist/iconify.js';
import Pagination from '@/components/Pagination/Pagination';
import usetoggleShowAdd from '../../../../store/usetoggleShowAdd';
import AddAccount from './AddAcount';

type Sorting = 'name' | 'price' | '';

const Accounts = () => {
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortBy, setSortBy] = useState<Sorting>('price');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | ''>('desc');
    const [useAccounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const {isAddAccToggled, toggleAddAcc} = usetoggleShowAdd()

    useEffect(() => {
        async function fetchAccounts() {
          try {
            const response = await fetch('/api/Query/Account');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAccounts(data);
          } catch (error) {
            console.error('Failed to fetch products:', error);
          } finally {
            setLoading(false);
          }
        }
        fetchAccounts();
      }, []);

  

      const AccountWithSearch = useAccounts?.filter((item: any) =>
        item?.email?.toLowerCase()?.includes(search.toLowerCase())
      );

      const itemsPerPage = 19;
      const totalItems = AccountWithSearch?.length || 0;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
    

      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
    

      const paginatedAccounts = AccountWithSearch?.slice(startIndex, endIndex);







    if (loading) {
    return <Loading/>
    }    

  return (
    <div>
        {isAddAccToggled && <AddAccount/>}
        <Titlebar title="Accounts" Icons='mdi:accounts-group'/>
        <button className='bg-lime-500 p-1 text-sm w-[200px] mt-2 p-2 border-4 border-solid border-lime-800' onClick={toggleAddAcc}>Add Account</button>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
        <div className='grid grid-cols-8 gap-0.5'>
            <div className='bg-lime-500 p-1 text-sm border-4 border-solid border-lime-800'>Account Code</div>
            <div className='bg-lime-500 p-1 text-sm border-4 border-solid border-lime-800'>Email</div>
            <div className='bg-lime-500 p-1 text-sm border-4 border-solid border-lime-800'>Password</div>
            <div className='bg-lime-500 p-1 text-sm border-4 border-solid border-lime-800'>Account Level</div>
            <div className='bg-lime-500 p-1 text-sm border-4 border-solid border-lime-800'>Mac Address</div>
            <div className='bg-lime-500 p-1 text-sm border-4 border-solid border-lime-800'>Date Created</div>
            <div className='bg-lime-500 p-1 text-sm border-4 border-solid border-lime-800'>Date Updated</div>
            <div className='bg-lime-500 p-1 text-sm border-4 border-solid border-lime-800'>Action</div>
        </div>
    {paginatedAccounts.map((item: any) => (
        <div className='grid grid-cols-8 gap-0.5 hover:bg-slate-100 ease-in-out duration-300 cursor-pointer' key={item.id}>
            <div className='text-sm p-1'>{item.accountCode}</div>
            <div className='text-sm p-1'>{truncateString(item.email, 10)}</div> 
            <div className='text-sm p-1'>{item.password}</div>
            <div className='text-sm p-1'>{item.accountLevel}</div>
            <div className='text-sm p-1'>{item.macAddress}</div>
            <div className='text-sm p-1'>{truncateString(item.dateCreated, 10)}</div> 
            <div className='text-sm p-1'>{truncateString(item.dateUpdated, 10)}</div> 
            <div className='text-sm p-1 grid grid-cols-3 text-center text-md justify-center'>
            <Icon icon="mdi:trash-can" className='text-2xl text-red-500'/>
            <Icon icon="mdi:pencil" className='text-2xl text-lime-800'/>
            <Icon icon="mdi:eye" className='text-2xl text-black-500'/>
            </div>
        </div>
    ))}
    </div>

  )
}

export default Accounts