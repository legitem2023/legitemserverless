'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js';
import Share from '../Share/Share';
import Link from 'next/link';
import TabData from './TabData';
import { useParams } from 'next/navigation';
import Loading from '../UI/Loading';
import Titlebar from '../UI/Titlebar';
import Paragraph from '../Partial/Paragraph';
import noImage from '../../../public/NoImage.png';

import Image from 'next/image';
import { truncateString } from '../../../utils/script';
import Ratings from '../Ratings/Ratings';
import PriceDisplay from './Price';
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

const RelatedProducts = ({Products}:any) => {
    const [loading, setLoading] = useState<boolean>(false);
    return (
        <div className="flex flex-wrap transform scale-98 h-[100vh] overflow-auto">
      {loading ? (
        <Loading />
      ) : (
        <div>
            {Products.map((view: any, idx: number) => (
                <div key={idx} className="grid grid-cols-4 gap-2 bg-[#f1f1f1] w-[100%] border-b-4 border-t-4 border-solid border-lime-800 mb-1 mt-1 scale-[0.99] p-1 bg-gradient-to-r from-lime-500 via-lime-700 to-lime-800">
                    <div className='flex flex-1 col-span-2'>
                    <Link href={`/ProductView/${view.id}/?data=${encodeURIComponent(JSON.stringify(view))}`}>

                        <Image src={view.thumbnail===null?noImage:view.thumbnail} 
                               alt={view.name} 
                               width='200' 
                               height='156' 
                               className='relatedImage'
                               quality={1}/>
                    </Link>    
                    </div>
                    <div className='flex flex-1 col-span-2'>
                        <div className="grid grid-cols-2 w-[100%]">
                            <span className="text-sm font-bold">Name</span><span className='text-sm font-bold'>{view.name!==null?truncateString(view.name, 10):'NO NAME'}</span>
                            <span className='text-xs'>Price </span>
                            <span className='text-xs'><PriceDisplay amount={view.price} /></span>
                            <span className="text-xs">Stock</span><span className='text-xs'>{view.stock} pc(s)</span>
                            <span className="text-xs">Views</span><span className='text-xs'>(0)</span>
                            <span className='text-xs col-span-2 flex justify-center align-center w-[100%]'>
                                <Ratings />
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}



        </div>
    )
}

export default RelatedProducts