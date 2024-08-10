'use client'
import React, { useEffect, useState } from 'react'
import useCategory from '../../../../store/useCategory';
import useNav from '../../../../store/useNav';
import Pagination from '../../Pagination/Pagination';
import Titlebar from '../../UI/Titlebar';
import { Icon } from '@iconify/react/dist/iconify.js';
import AddItem from './AddItem';
import useToggleStore from '../../../../store/usetoggle';
import Loading from '@/components/UI/Loading';
type Sorting = 'name' | 'price' | '';

const Inventory = () => {
    const { text } = useCategory();
    const { setNav } = useNav();
  
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortBy, setSortBy] = useState<Sorting>('price');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | ''>('desc');
    const [useProduct, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { isToggled, toggle } = useToggleStore();

    useEffect(() => {
      async function fetchInventory() {
        try {
          const response = await fetch('/api/Query/Inventory');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchInventory();
    }, []);
  
    const ProductsWithSearch = useProduct?.filter((item: any) =>
      item?.name?.toLowerCase()?.includes(search.toLowerCase())
    );
  
    const ProductCategory = ProductsWithSearch?.filter((item: any) =>
      item?.category?.toLowerCase()?.includes(text.toLowerCase())
    );
  
    const itemsPerPage = 10;
    const totalItems = ProductCategory?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentPage(1);
      setSearch(e.target.value);
    };
  
    const handleSort = (column: Sorting) => {
      if (sortBy === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(column);
        setSortDirection('asc');
      }
    };
  
    const sortedProducts = ProductCategory?.sort((a: any, b: any) => {
      let sort;
  
      if (sortBy === 'price') {
        if (!a?.price || !b?.price) {
          return 0;
        }
        sort = sortDirection === 'asc' ? a?.price - b?.price : b?.price - a?.price;
      }
  
      if (sortBy === 'name') {
        if (!a?.name || !b?.name) {
          return 0;
        }
        sort = sortDirection === 'asc' ? a?.name.localeCompare(b?.name) : b?.name.localeCompare(a?.name);
      }
      return sort;
    });
  
    const paginatedProducts = sortedProducts?.slice(startIndex, endIndex);
  
   console.log(isToggled)
  if (loading) {
    return <Loading/>
  }
  return (
    <div>
        <Titlebar title="Inventory" Icons='mdi:cart'/>
            {isToggled?<AddItem/>:null}
            
          <button className='bg-lime-500 p-1 text-sm w-[200px] mt-2 p-2 border-4 border-solid border-lime-800' onClick={toggle}>Add Item</button>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
        <div className='grid grid-cols-11 gap-0.5'>
            <div className='bg-lime-500 p-1 text-sm'>Product Code</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Type</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Category</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Name</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Color</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Size</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Price</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Stock</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Creator</div>
            <div className='bg-lime-500 p-1 text-sm'>Product Editor</div>
            <div className='bg-lime-500 p-1 text-sm'>Action</div>
        </div>
        {
  paginatedProducts.map((item: any,idx:number) => (
        <div className='grid grid-cols-11 hover:bg-slate-100 ease-in-out duration-300 cursor-pointer' key={idx}>
            <div className='text-sm p-1'>{item.productCode}</div>
            <div className='text-sm p-1'>{item.productType}</div>
            <div className='text-sm p-1'>{item.category}</div>
            <div className='text-sm p-1'>{item.name}</div>
            <div className='text-sm p-1'>{item.color}</div>
            <div className='text-sm p-1'>{item.size}</div>
            <div className='text-sm p-1'>{item.price}</div>
            <div className='text-sm p-1'>{item.stock}</div>
            <div className='text-sm p-1'>{item.creator}</div>
            <div className='text-sm p-1'>{item.editor}</div>
            <div className='text-sm p-1 flex flex-row text-center text-md justify-center'>
                <Icon icon="mdi:trash-can"/>
                <Icon icon="mdi:pencil"/>
            </div>
        </div>
        ))
        }
        </div>
  )
}

export default Inventory