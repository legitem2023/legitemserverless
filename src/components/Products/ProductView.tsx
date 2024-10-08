'use client';
import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react/dist/iconify.js';
import Share from '../Share/Share';
import Link from 'next/link';
import TabData from './TabData';
import { useParams,useSearchParams } from 'next/navigation';
import Loading from '../UI/Loading';
import Titlebar from '../UI/Titlebar';
import Paragraph from '../Partial/Paragraph';
import RelatedProducts from './RelatedProducts';
import ModelViewer from '../Gallery/ModelViewer';
import HorizontalTabs from '../Partial/HorizontalTabs';
import Gallery from '../Gallery/Gallery';
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
    const parameter:any = useSearchParams();
    const parsedData = JSON.parse(parameter.get('data'));

    // const relatedProd = JSON.parse(parameter.get('relatedProd'));
    // const relatedProdArray:any = Array.isArray(relatedProd) ? relatedProd : [relatedProd];

    const dataArray:any = Array.isArray(parsedData) ? parsedData : [parsedData];
    const filtered = useProduct;




    const tabs = [
        { icon: 'icomoon-free:address-book', label: 'Image', content: <Gallery data={dataArray}/> },
        { icon: 'mdi:border-all', label: 'Model', content: <ModelViewer/> },
      ];



    return (
        <div className="flex flex-wrap transform scale-98 h-[100vh]">
      {loading ? (
        <Loading />
      ) : (
        <div>
            {dataArray.map((view: any, idx: number) => (
                <div key={idx} className="grid lg:grid-cols-4 gap-0 bg-[#f1f1f1] w-[99vw]">
                    <div className="lg:col-span-3 grid lg:grid-cols-3">
                        <div className='lg:col-span-3 bg-gradient-to-l from-lime-500 via-lime-700 to-lime-800'>
                            <div className='flex flex-1'>
                            <Titlebar title='Products Data' Icons='mdi:database'/></div>
                        </div>
                        <div className='flex lg:col-span-3 bg-[#f1f1f1] h-[5vh]'>
                            <Link href="/" className="lg:col-span-3 flex items-center justify-center h-full px-5 text-1xl">
                                <Icon icon="ic:sharp-double-arrow" className='flex-1 h-[100%]' style={{ transform: 'scaleX(-1)' }} /> Back
                            </Link>
                        </div>

                        <div className='lg:col-span-2'>
                            <TabData data={dataArray}/>
                        </div>
                        <div className='lg:col-span-1 flex flex-col bg-[#f1f1f1]'>
                            <div className='grid grid-cols-2 border-b-2 border-stone-300 m-2'>
                                <div className='m-[5px] flex items-center'>Name:</div><div className='m-[5px] flex items-center '>{view.name}</div>
                            </div>
                            <div className='grid grid-cols-2 border-b-2 border-stone-300 m-2'>
                                <div className='m-[5px] flex items-center'>Price:</div><div className='m-[5px] flex items-center'>{view.price}</div>
                            </div>
                            <div className='grid grid-cols-2 border-b-2 border-stone-300 m-2'>
                                <div className='m-[5px] flex items-center'>Size:</div><div className='m-[5px] flex items-center'>{view.size}</div>
                            </div>
                            <div className='grid grid-cols-2 border-b-2 border-stone-300 m-2'>
                                <div className='m-[5px] flex items-center'>Color:</div><div className='m-[5px] flex items-center'>{view.color}</div>                            
                            </div>
                            <div className='grid grid-cols-2 border-b-2 border-stone-300 m-2'>
                                <div className='m-[5px] flex items-center'>Available Stock:</div><div className='m-[5px] flex items-center'>{view.stock}</div>                        
                            </div>
                            <div className='grid grid-cols-2 border-b-2 border-stone-300 m-2'>
                                <div className='m-[5px] flex items-center'>Quantity</div><div className='m-[5px] flex items-center'></div>
                                <div className='col-span-2 grid grid-cols-7 w-[98%] h-[auto] align-center items-center justify-center'>
                                    <Icon icon="mdi:add-box" className='col-span-1 flex h-[4vh] w-[65px]' />
                                    <input type='number' defaultValue='1' className='col-span-5 h-[3vh] flex w-[100%] text-center outline-none' />
                                    <Icon icon="mdi:minus-box" className='col-span-1 flex h-[4vh] w-[65px]' />
                                </div>
                            </div>

                            <div className='flex w-[100%] align-center justify-center item-center w-[100%] m-[auto] col-span-2'>
                                <Icon icon="fa-solid:cart-plus" className='text-5xl m-2' />
                            </div>
                            <div className='col-span-2 grid grid-row w-[100%] h-[auto] align-center justify-center'>
                                <Share></Share>
                            </div>
                        </div>
                        {/* <div className='flex lg:col-span-3 bg-[#f1f1f1] h-[5vh]'></div> */}
                        <div className='flex lg:col-span-3'>
                            <Titlebar title='Store Details' Icons='fa-solid:store'/>
                        </div>
                        <div className='flex lg:col-span-3 m-2 w-[auto]'>
                            <Paragraph Paragraph={'What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'}/>
                        </div>
                        <div className='flex lg:col-span-3'>
                            <Titlebar title='Product Details' Icons='mdi:tags'/>
                        </div>
                        <div className='flex lg:col-span-3 m-2 w-[auto]'>
                            <Paragraph Paragraph={'What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'}/>
                        </div>
                        <div className='flex lg:col-span-3'>
                            <Titlebar title='Product Reviews' Icons='material-symbols:share-reviews-outline-sharp'/>
                        </div>
                        <div className='flex lg:col-span-3 m-2 w-[auto]'>
                            <Paragraph Paragraph={'What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'}/>
                        </div>
                    </div>
                    <div className="col-span-1 bg-[#f1f1f1]">
                        <div className='flex flex-1'>
                            <Titlebar title='Related Product' Icons='fluent-mdl2:relationship'/>
                        </div>
                        <div className='flex flex-1'>
                            <RelatedProducts Products={useProduct}></RelatedProducts>
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