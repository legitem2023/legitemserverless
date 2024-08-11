'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import Image from 'next/image';
import noImage from '../../../public/NoImage.png';

export const HomeGallery = () => {
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

  return (
    <Swiper
      spaceBetween={5}
      loop={true}
      breakpoints={{
        // when window width is >= 1200px (Large Desktop)
        1200: {
          slidesPerView: 4,
        },
        // when window width is >= 992px (Desktop)
        992: {
          slidesPerView: 3,
        },
        // when window width is >= 768px (Tablet Landscape / iPad Pro)
        768: {
          slidesPerView: 3,
        },
        // when window width is >= 576px (Tablet Portrait / iPad)
        576: {
          slidesPerView: 2,
        },
        // when window width is < 576px (Mobile)
        0: {
          slidesPerView: 2,
        },
      }}
      className="w-full"
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}>
      {useProduct.map((item: any, i: any) => (
        <SwiperSlide key={i}>
          <Image
            key={i}
            src={item.thumbnail === null ? noImage.src : item.thumbnail}
            alt={"alt" + i}
            width={200}
            height={150}
          />
          {item.title}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
