'use client'
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import Image from 'next/image';
export const HomeGallery = () => {
  const [useProduct, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch('/api/readThumbnail');
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


  return (
    <div>
      <div className="slider-container flex justify-center  sm:w-[100vw] md:w-[55.56vw] lg:w-[55.56vw] xl:w-[55.56vw] 2xl:w-[55.56vw]  bg-lime-900 p-2">
      <Swiper
      spaceBetween={50}
      slidesPerView={4}
      loop={true}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {useProduct.map((item:any, i:any) => (
        <SwiperSlide key={i}>
            <Image key={i} src={item.thumbnail} alt={"alt" + i} width='200' height='150' />
            {item.title}
        </SwiperSlide>
        ))}
    </Swiper>
      </div>
    </div>
  );
}

