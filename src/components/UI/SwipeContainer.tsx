"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { setActiveIndex } from "../Redux/swipeSlice";
import { useEffect, useRef } from "react";

interface SwipeContainerProps {
  items: React.ReactNode[];
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ items }) => {
  const dispatch = useDispatch();
  const activeIndex = useSelector((state: any) => state.swipe.activeIndex);
  const swiperRef = useRef<any>(null); // Swiper reference

  // Update Swiper when Redux state changes
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(activeIndex);
    }
  }, [activeIndex]);

  return (
    <Swiper
      allowTouchMove={false}
      ref={swiperRef}
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      initialSlide={activeIndex} // Set initial slide from Redux state
      
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{item}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwipeContainer;
