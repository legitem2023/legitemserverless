'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js';
import Share from '../Share/Share';
import Link from 'next/link';
import TabData from './TabData';
import { useParams } from 'next/navigation';
import Loading from '../UI/Loading';
type Inventory = {
    id: string;
    name: string | null;
    price: number | null;
    thumbnail: string | null;
    category: string | null;

}[]
type Props = {
    Inventory: Inventory[];
};

const ProductView = () => {
    const [useProduct, setProducts] = useState([]);
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

    const searchParams = useParams();
    const filtered = useProduct.filter((item: any) => item.id === searchParams.id);
    return (
        <div className="flex flex-wrap transform scale-98 h-[100vh]">
      {loading ? (
        <Loading />
      ) : (
        <div>
                        {filtered.map((view: any, idx: number) => (
                <div key={idx} className="grid lg:grid-cols-4 gap-0 bg-[#f1f1f1] w-[100vw]">
                    <div className="lg:col-span-3 grid lg:grid-cols-3">
                        <div className='lg:col-span-3 bg-gradient-to-l from-lime-500 via-lime-700 to-lime-800'>
                            <div className='flex flex-1 p-2 border-t-4 border-b-4 border-solid border-lime-700 flex-row align-center bg-lime-600 h-[5vh]'>Products Data</div>
                        </div>
                        <div className='flex lg:col-span-3 bg-[#f1f1f1] h-[5vh]'>
                            <Link href="/" className="lg:col-span-3 flex items-center justify-center h-full px-5 text-1xl">
                                <Icon icon="ic:sharp-double-arrow" className='flex-1 h-[100%]' style={{ transform: 'scaleX(-1)' }} /> Back
                            </Link>
                        </div>

                        <div className='lg:col-span-2'>
                            <TabData data={filtered}/>
                        </div>
                        <div className='lg:col-span-1 grid grid-cols-2'>
                            <div className='m-[10px]'>Name:</div><div className='m-[10px]'>{view.name}</div>
                            <div className='m-[10px]'>Price:</div><div className='m-[10px]'>{view.price}</div>
                            <div className='m-[10px]'>Size:</div><div className='m-[10px]'>{view.size}</div>
                            <div className='m-[10px]'>Color:</div><div className='m-[10px]'>{view.color}</div>
                            <div className='col-span-2 grid grid-cols-7 w-[98%] h-[4vh] align-center justify-center'>
                                <Icon icon="mdi:add-box" className='col-span-1 flex h-[4vh] w-[65px]' />
                                <input type='number' defaultValue='1' className='col-span-5 flex w-[100%] text-center' />
                                <Icon icon="mdi:minus-box" className='col-span-1 flex h-[4vh] w-[65px]' />
                            </div>
                            <div className='flex w-[100%] align-center justify-center item-center w-[100%] m-[auto] col-span-2 m-b-5 m-t-5'>
                                <Icon icon="fa-solid:cart-plus" className='text-3xl m-5' />
                            </div>
                            <div className='col-span-2 grid grid-row w-[100%] h-[5vh] align-center justify-center m-b-5 m-t-5'>
                                <Share></Share>
                            </div>
                        </div>
                        <div className='flex lg:col-span-3 bg-[#f1f1f1] h-[5vh]'></div>
                        <div className='flex lg:col-span-3 px-3 border-t-4 border-b-4 border-solid border-lime-700 flex-row items-center  bg-lime-600 h-[5vh]'>
                            Store Details
                        </div>
                        <div className='flex lg:col-span-3 m-2 w-[auto]'>
                            What is Lorem Ipsum?
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </div>
                        <div className='flex lg:col-span-3 px-3 border-t-4 border-b-4 border-solid border-lime-700 flex-row items-center  bg-lime-600 h-[5vh]'>
                            Product Details
                        </div>
                        <div className='flex lg:col-span-3 m-2 w-[auto]'>
                            What is Lorem Ipsum?
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </div>
                        <div className='flex lg:col-span-3 px-3 border-t-4 border-b-4 border-solid border-lime-700 flex-row items-center  bg-lime-600 h-[5vh]'>
                            Product Review
                        </div>
                        <div className='flex lg:col-span-3 m-2 w-[auto]'>
                            What is Lorem Ipsum?
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </div>
                    </div>
                    <div className="col-span-1 bg-[#f1f1f1]">
                        <div className='flex flex-1 p-2 border-t-4 border-b-4 border-solid border-lime-700 flex-row align-center bg-lime-600 h-[5vh]'>
                            Related Product
                        </div>

                    </div>
                </div>
            ))}
        </div>
      )}



        </div>
    )
}

export default ProductView