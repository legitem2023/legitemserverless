'use client';
import React, { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import { Input } from '../UI/Input';
import { Icon } from '@iconify/react/dist/iconify.js';
import PriceDisplay from './Price';
import Gallery from '../Gallery/Gallery';
import useCategory from '../../../store/useCategory';
import Ratings from '../Ratings/Ratings';
import useNav from '../../../store/useNav';
import { truncateString } from '../../../utils/script';
import Link from 'next/link';
import Titlebar from '../UI/Titlebar';
import Loading from '../UI/Loading';
import noImage from '../../../public/NoImage.png';
import Image from 'next/image';
import useCurrentPage from '../../../store/useCurrentPage';
import { usePathname } from 'next/navigation';
type Sorting = 'name' | 'price' | '';

const Thumbnail = () => {
  const { text } = useCategory();
  const { setNav } = useNav();
  const { currentPageNo,  } = useCurrentPage();

  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(currentPageNo);
  const [sortBy, setSortBy] = useState<Sorting>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | ''>('desc');
  const [useProduct, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch('/api/Query/readThumbnail');
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

  const itemsPerPage = 24;
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

  const pathname = usePathname();
  const isProductRoute = pathname.startsWith('/Product');  

  return (
    <div className='flex flex-wrap justify-left md:justify-center gap-0 md:w-full lg:w-[55.56vw]'>
        {!isProductRoute?(
                  <div className='flex justify-center w-[100%]'>
                  <div className='lg:m-1 m-1 flex flex-wrap flex-row'>
                    <div className='flex-1'>
                      <Gallery data={useProduct} />
                    </div>
                  </div>
                </div>
        ):""}
        <div className='flex justify-center w-[100%]'>
          <div className='flex flex-row m-1 w-[100%] gap-1 p-1 border-4 border-solid border-lime-600 bg-gradient-to-r from-lime-500 via-lime-700 to-lime-800'>
            <Input
              value={search}
              placeholder='Search'
              onChange={handleSearch}
              className='bg-transparent'
            />
            <select className='w-[20vw]' onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSort(e.target.value as Sorting)}>
              <option value=''>Sort</option>
              <option value='name'>By Name</option>
              <option value='price'>By Price</option>
            </select>
          </div>
        </div>
      {loading ? (<Loading />):(
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-[100vw] m-1">
            <div className='flex flex-1  col-span-2 sm:grid-cols-2 md:col-span-3 lg:col-span-4 xl:col-span-5 2xl:col-span-6 flex-row align-center'>
              <Titlebar title="Products" Icons='mdi:cart'/>
            </div>
            {paginatedProducts.length > 0 ?paginatedProducts?.map((product: any, i: number) => (
              <div key={i} className="flex-shrink-0 relative overflow-hidden border-4 border-lime-600 rounded-lg max-w-xs cursor-pointer m-1 addShadow bg-gradient-to-t from-lime-500 via-lime-700 to-lime-800">
                <Link href={`/ProductView/${product.id}/?data=${encodeURIComponent(JSON.stringify(product))}`}>
                  <Image
                    src={product.thumbnail===null || product.thumbnail===""?noImage.src:product.thumbnail}
                    className="relative w-[100%] transition-transform transform hover:scale-110 duration-500"
                    alt={"alt" + i}
                    width='200' 
                    height='156' 
                    quality={1}
                  />
                </Link>
                <div className="relative text-white grid grid-cols-3 p-1">
                  <span className="flex-1 col-span-1 text-shadow-sm text-sm font-bold">Name</span>
                  <span className='col-span-2 text-sm font-bold'>{truncateString(product.name, 9)}</span>
                  <span className="flex-1 col-span-1 text-shadow-sm text-xs">Stock</span>
                  <span className='col-span-2 text-xs'>{product.stock} pc(s)</span>
                  <span className="flex-1 col-span-1 text-shadow-sm text-xs">View</span>
                  <span className='col-span-2 text-xs'>(0)</span>
                </div>
                <div className="relative text-white m-3 flex flex-wrap flex-row">
                  <span className="flex-1 block bg-white rounded-full text-lime-950 text-xs font-bold px-2 py-1 leading-none flex items-center"><PriceDisplay amount={product.price} /></span>
                  <span className="flex-1 flex bg-transparent justify-center align-center rounded-full py-1"></span>
                  <span className="flex-1 flex bg-lime-800 justify-center align-center rounded-full py-1"><Icon icon="mdi:heart" style={{ right: "0px" }} /></span>
                </div>
                <div className="relative text-white m-3 flex flex-wrap flex-row justify-center align-center item-center">
                  <span className='col-span-3 flex'><Ratings /></span>
                </div>
              </div>
            )):(<div className='flex flex-1  col-span-2 sm:grid-cols-2 md:col-span-3 lg:col-span-4 xl:col-span-5 2xl:col-span-6 flex-row align-center justify-center text-center text-3xl font-bold'>No Data</div>)}
          </div>
          <div className='flex sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  justify-center w-[100vw] '>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Thumbnail;
