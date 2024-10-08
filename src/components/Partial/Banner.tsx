'use client';
import { usePathname } from 'next/navigation';
import React from 'react'

const Banner = () => {

    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/Account');
    const isAdminRoute_2 = pathname.startsWith('/SignIn');
    const isAdminRoute_3 = pathname.startsWith('/Administrator');
  
    if (isAdminRoute || isAdminRoute_2 || isAdminRoute_3) {
      return null; // Return null if not on an admin route
    }
  
  return (
    <nav id="Banner" className='flex flex-wrap flex-col absolute portrait:relative top-[8vh] h-[100%] text-lime-950  portrait:w-[100vw] portrait:h-[auto] landscape:w-[21.80vw] z-30 m-auto transition ease-in-out bg-lime-500'>
        <video src="https://res.cloudinary.com/confirmed-web/video/upload/q_auto/v1706456665/adidas-group/media/pictures-videos/adidas_retail_master_fullhd_ib4gae.mp4#t=0.001" autoPlay loop muted></video>
    </nav>
  )
}

export default Banner