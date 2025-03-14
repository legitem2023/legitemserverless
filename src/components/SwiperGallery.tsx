// components/SwiperGallery.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperGalleryProps {
  images: string[]; // Array of image URLs
  slidesPerView?: { desktop: number; tablet: number; mobile: number };
  loop?: boolean;
  autoplay?: boolean;
}

const SwiperGallery: React.FC<SwiperGalleryProps> = ({
  images,
  slidesPerView = { desktop: 4, tablet: 2, mobile: 1 },
  loop = true,
  autoplay = true,
}) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      loop={loop}
      autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
      breakpoints={{
        1024: { slidesPerView: slidesPerView.desktop },
        768: { slidesPerView: slidesPerView.tablet },
        320: { slidesPerView: slidesPerView.mobile },
      }}
      className="w-full"
    >
      {images.map((src, index) => (
        <SwiperSlide key={index} className="flex items-center justify-center">
          <img
            src={src}
            alt={`Slide ${index}`}
            className="w-full h-auto object-cover rounded-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperGallery;