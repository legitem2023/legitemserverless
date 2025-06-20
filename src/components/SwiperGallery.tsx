"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

interface SwiperGalleryProps {
  images: string[]; // Array of image URLs
  slidesPerView?: { desktop: number; tablet: number; mobile: number };
  loop?: boolean;
  autoplay?: boolean;
}

const SwiperGallery: React.FC<SwiperGalleryProps> = ({
  images,
  slidesPerView = { desktop: 1, tablet: 1, mobile: 1 },
  loop = true,
  autoplay = true,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="w-full">
      {/* Main Swiper with 4:3 aspect ratio */}
      <div className="w-full aspect-[4/3]">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          loop={loop}
          autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
          thumbs={{ swiper: thumbsSwiper }}
          className="w-full h-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <img
                src={src}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Swiper with 4:3 aspect ratio */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Navigation, Thumbs]}
        slidesPerView={4}
        spaceBetween={10}
        watchSlidesProgress
        className="mt-4 w-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="cursor-pointer">
            <div className="w-full aspect-[4/3]">
              <img
                src={src}
                alt={`Thumbnail ${index}`}
                className="w-full h-full object-cover rounded-md border border-gray-300"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperGallery;
